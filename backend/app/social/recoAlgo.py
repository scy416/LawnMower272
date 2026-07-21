import numpy as np
import logging
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from sqlalchemy.orm import Session

from app.database.database import SessionLocal 
from app.database.models import UserProfile, UserModule, DiscoverCache, Module

logging.basicConfig(
    filename='server.log',
    filemode='a',
    level=logging.ERROR, 
    format='%(asctime)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def compute_daily_recommendations():
    db = SessionLocal()
    
    try:
        profiles = db.query(UserProfile).all()
        
        
        if not profiles:
            print("No profiles found in the database.")
            return

        user_id_to_index = {p.user_id: idx for idx, p in enumerate(profiles)}
        index_to_user_id = {idx: uid for uid, idx in user_id_to_index.items()}

        all_modules = db.query(Module.code).all()
        unique_modules = {row[0] for row in all_modules}
        
        module_to_index = {mod: idx for idx, mod in enumerate(unique_modules)}
        num_users = len(profiles)
        num_modules = len(unique_modules)

    #building of matrices
        taken_rows, taken_cols, taken_data = [], [], []
        want_rows, want_cols, want_data = [], [], []

        for p in profiles:
            u_idx = user_id_to_index[p.user_id]
            
            if p.modulesTaken:
                for mod in p.modulesTaken:
                    if mod in module_to_index:
                        m_idx = module_to_index[mod]
                        taken_rows.append(u_idx)
                        taken_cols.append(m_idx)
                        taken_data.append(1.0) 

            if p.modulesToTake:
                for mod in p.modulesToTake:
                    if mod in module_to_index:
                        m_idx = module_to_index[mod]
                        want_rows.append(u_idx)
                        want_cols.append(m_idx)
                        want_data.append(1.0)

        if not taken_data:
            print("Not enough module data to compute recommendations.")
            return

        M_taken = csr_matrix((taken_data, (taken_rows, taken_cols)), shape=(num_users, num_modules))
        M_want = csr_matrix((want_data, (want_rows, want_cols)), shape=(num_users, num_modules))

    #calculations
        base_similarity = cosine_similarity(M_taken)
        mentor_signal = M_want.dot(M_taken.T).toarray()

        recommendations = {}

        WEIGHT_SIMILARITY = 1.0
        WEIGHT_MENTOR = 1.5 
        SENIOR_BONUS = 1.0  

        for u_idx, current_profile in enumerate(profiles):
            current_user_id = current_profile.user_id
            final_scores = np.zeros(num_users)
            
            for candidate_idx, candidate_profile in enumerate(profiles):
                if candidate_idx == u_idx:
                    continue 

                score = 0.0

                score += base_similarity[u_idx, candidate_idx] * WEIGHT_SIMILARITY
                mentor_overlap = mentor_signal[u_idx, candidate_idx]
                if mentor_overlap > 0:
                    score += mentor_overlap * WEIGHT_MENTOR

                    my_year = current_profile.year or 1
                    their_year = candidate_profile.year or 1
                    if their_year > my_year:
                        score += SENIOR_BONUS
                
                final_scores[candidate_idx] = score

            top_indices = np.argsort(final_scores)[::-1]
            
            top_matches = []
            for match_idx in top_indices:
                if final_scores[match_idx] > 0:
                    match_id = index_to_user_id[match_idx]
                    top_matches.append(match_id)
                    
                if len(top_matches) == 10:
                    break
                    
            recommendations[current_user_id] = top_matches
        
        db.query(DiscoverCache).delete()
        
        cache_objects = []
        for user_id, match_ids in recommendations.items():
            cache_entry = DiscoverCache(
                user_id=user_id,
                recommended_ids=match_ids
            )
            cache_objects.append(cache_entry)

        db.add_all(cache_objects)
        db.commit()
        
        print("update success"), #for debugging if needed
        return recommendations

    except Exception as e:
        db.rollback()
        print(f"An error occurred: {e}") #for my own debugging
        logging.error(f"algorithm crashed: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    compute_daily_recommendations()

#TODO : SET UP AUTOMATIC SCHEDULER TO RUN THIS SCRIPT
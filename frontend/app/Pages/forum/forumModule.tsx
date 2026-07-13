import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { userAuth } from "~/hooks";
import styles from "./forum.module.css";

interface Review {
  id: number;
  author_id: number;
  author_username: string;
  module_code: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface Summary {
  module_code: string;
  review_count: number;
  avg_rating: number;
}

function renderStars(n: number) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ForumModule() {
  const { moduleCode } = useParams();
  const navigate = useNavigate();
  const { getToken, getUserId, handleUnauthorized } = userAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const code = moduleCode?.toUpperCase() ?? "";

  const fetchData = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const reviewRes = await fetch(`http://localhost:8000/forum/reviews/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (reviewRes.status === 401) {
        handleUnauthorized();
        return;
      }

      if (reviewRes.ok) setReviews(await reviewRes.json());

      const summaryRes = await fetch(`http://localhost:8000/forum/summary/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (summaryRes.ok) setSummary(await summaryRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUserId(getUserId());
    fetchData();
  }, [code]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/forum/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ module_code: code, rating, comment: comment.trim() || null }),
      });
      if (res.ok) {
        setRating(0);
        setComment("");
        fetchData();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Delete your review?")) return;
    const token = getToken();
    if (!token) return;
    const res = await fetch(`http://localhost:8000/forum/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchData();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topbar}>
          <div className={styles["topbar-title"]}>SyllaBuddy Forum</div>
          <div className={styles["nav-links"]}>
            <button className="nav-btn-global" onClick={() => navigate("/forum")}>
              Forum
            </button>
            <button className="nav-btn-global" onClick={() => navigate("/timetable")}>
              Home
            </button>
          </div>
        </div>

        <div className={styles["module-header"]}>
          <div className={styles["module-title"]}>{code}</div>
          {loading ? (
            <div className={styles["rating-text"]}>Loading ratings...</div>
          ) : (
            <>
              <div className={styles["star-display"]}>
                {summary && summary.review_count > 0
                  ? renderStars(Math.round(summary.avg_rating))
                  : "☆☆☆☆☆"}
              </div>
              <div className={styles["rating-text"]}>
                {summary && summary.review_count > 0
                  ? `${summary.avg_rating.toFixed(1)} / 5.0 · ${summary.review_count} review${summary.review_count !== 1 ? "s" : ""}`
                  : "No reviews yet — be the first!"}
              </div>
            </>
          )}
        </div>

        <div className={styles["review-form"]}>
          <div className={styles["form-title"]}>Leave a Review</div>

          <label className={styles["form-label"]}>Your Rating</label>
          <div className={styles["star-row"]}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={styles["star-btn"]}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
              >
                {n <= (hoverRating || rating) ? "★" : "☆"}
              </button>
            ))}
          </div>

          <label className={styles["form-label"]}>Comment (optional)</label>
          <textarea
            className={styles["comment-input"]}
            placeholder="Share your thoughts about this module..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            className={styles["submit-btn"]}
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        <div className={styles["reviews-title"]}>
          💬 {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
        </div>

        {reviews.length === 0 ? (
          <p className={styles.empty}>No reviews yet. Add the first one above!</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className={styles["review-card"]}>
              <div className={styles["review-card-header"]}>
                <button
                  className={styles["author-btn"]}
                  onClick={() => navigate(`/Profile/${r.author_id}`)}
                >
                  {r.author_username}
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className={styles["review-stars"]}>{renderStars(r.rating)}</span>
                  {currentUserId === r.author_id && (
                    <button
                      className={styles["delete-btn"]}
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              {r.comment && (
                <div className={styles["review-body"]}>{r.comment}</div>
              )}
              <div className={styles["review-time"]}>{timeAgo(r.created_at)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

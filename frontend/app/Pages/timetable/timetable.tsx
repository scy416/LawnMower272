import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './timetable.module.css'; 
import { getCurrentSemesterWeek } from '~/utils';
import { type Assignment } from '../../types';
import { getProfile, getFriends, getPendingRequests, getInbox } from '../../hooks';
import ModuleSearch from './moduleSearch';

function Timetable() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [moduleInput, setModuleInput] = useState<string>('');
  
  const { profile, loadProfileInfo } = getProfile();
  const { friends } = getFriends();
  const { pendingRequests } = getPendingRequests();
  const { conversations } = getInbox();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const handleStartChat = async (targetUserId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/social/chat/${targetUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/chat/${data.conversation_id}`);
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  const handleRemoveModule = async (moduleCode: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:8000/api/modules/${moduleCode}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setAssignments(assignments.filter(task => task.module_code !== moduleCode));;
      }
    } catch (error) {
      console.error("Error removing module:", error);
      setAssignments(assignments.filter(task => task.module_code !== moduleCode));
    }
  };

  useEffect(() => {
    loadProfileInfo();
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch('http://localhost:8000/api/timetable', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data: Assignment[]) => {
        if (Array.isArray(data)) {
          setAssignments(data);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [navigate]);

  const handleAddModule = async (moduleCode: string) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch('http://localhost:8000/api/modules', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Pass the code we received from the child component!
      body: JSON.stringify({ module_code: moduleCode }), 
    });

    if (response.ok) {
      const newModuleAssignments: Assignment[] = await response.json();
      const existingIds = new Set(assignments.map(a => a.id));
      const filteredNew = newModuleAssignments.filter(a => !existingIds.has(a.id));
      setAssignments([...assignments, ...filteredNew]);
    }
  } catch (error) {
    console.error("Error adding module:", error);
  }
};
  /* const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch('http://localhost:8000/api/modules', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ module_code: moduleInput }),
      });

      if (response.ok) {
        const newModuleAssignments: Assignment[] = await response.json();
        
        const existingIds = new Set(assignments.map(a => a.id));
        const filteredNew = newModuleAssignments.filter(a => !existingIds.has(a.id));
        
        setAssignments([...assignments, ...filteredNew]);
        setModuleInput('');
      }
    } catch (error) {
      console.error("Error adding module:", error);
    }
  }; */

  const uniqueModules = Array.from(new Set(assignments.map(task => task.module_code)));

  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12', 'W13'];

  const numModules = uniqueModules.length;

  const currentWeek = `W${getCurrentSemesterWeek()}`;
  const thisWeekCount = assignments.filter(
    task => task.deadline.toUpperCase() === currentWeek.toUpperCase()
  ).length;

  let peakWeek = 'N/A';
  let peakCount = 0;
  
  const weekCounts: Record<string, number> = {};
  assignments.forEach(task => {
    const dl = task.deadline.toUpperCase();
    if (!weekCounts[dl]) 
      weekCounts[dl] = 0;
    weekCounts[dl]++;
  });

  for (const [week, count] of Object.entries(weekCounts)) {
    if (count > peakCount) {
      peakCount = count;
      peakWeek = week;
    }
  }

  return (
    <div className={styles['timetable-page']}>
      
      <div className={styles.topbar}>
        <div className={styles['topbar-title']}>
          SyllaBuddy
        </div>
        <div style={{gap: '12px', display: 'flex', alignItems: 'center'}}>
            <button className="nav-btn-global" onClick={handleLogout}>
              Sign out
            </button>
          </div>
      </div>

      <div className={styles['layout-container']}>

        <div className={styles['dashboard-container']}>
        
        <ModuleSearch onAddModule={handleAddModule} />

        <div className={styles.summary}>
          
          <div className={styles.scard}>
            <div className={styles['scard-label']}>This week</div>
            <div className={styles['scard-val']}>{thisWeekCount}</div>
            <div className={styles['scard-sub']}>deadlines</div>
          </div>

          <div className={styles.scard}>
            <div className={styles['scard-label']}>Peak week</div>
            <div className={`${styles['scard-val']} ${styles['scard-val-red']}`}>{peakWeek}</div>
            <div className={styles['scard-sub']}>{peakCount} deadlines</div>
          </div>

          <div className={styles.scard}>
            <div className={styles['scard-label']}>Modules</div>
            <div className={styles['scard-val']}>{numModules}</div>
            <div className={styles['scard-sub']}>enrolled</div>
          </div>

        </div>

        <div className={styles['grid-wrapper']}>
          <div className={styles.grid}>
            
            <div className={styles['col-head']}></div>
            {weeks.map(week => (
              <div key={week} className={styles['col-head']}>{week}</div>
            ))}

            {uniqueModules.map(moduleCode => (
              <React.Fragment key={moduleCode}>
                
                <div className={styles['row-label']}>
                  <span className={styles['module-name']}>{moduleCode}</span>
                  <button 
                    type="button"
                    className={styles['remove-mod-btn']} 
                    onClick={() => handleRemoveModule(moduleCode)}
                    title={`Remove ${moduleCode}`}
                  >
                    &times;
                  </button>
                </div>

                {weeks.map(week => {
                  const tasksInWeek = assignments.filter(
                    task => task.module_code === moduleCode && task.deadline.toUpperCase() === week.toUpperCase()
                  );

                  return (
                    <div key={week} className={styles.cell}>
                      {tasksInWeek.map(task => (
                        <div key={task.id} className={styles['task-badge']}>
                          {task.assignment_name}
                        </div>
                      ))}
                    </div>
                  );
                })}

              </React.Fragment>
            ))}

          </div>
        </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles['sidebar-section']}>
            <button className={styles['sidebar-header']} onClick={() => navigate("/social")}
              style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span>Friends</span>
              {friends && <span className={styles['friend-count-badge']}>{friends.length}</span>}
            </button>
          </div>
          <div className={styles['sidebar-section']}>
            <button className={styles['sidebar-header']} onClick={() => navigate("/profile")}>Profile</button>
            <div className={styles['sidebar-content']}>
              {profile ? (
                <div className={styles['sidebar-profile-row']}>
                  <div className={styles['sidebar-avatar']}>
                    {profile.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className={styles['sidebar-profile-info']}>
                    <span className={styles['sidebar-name']}>{profile.username}</span>
                    <span className={styles['sidebar-bio']}>{profile.bio || 'No bio set'}</span>
                    <span className={styles['sidebar-bio']}>
                      {profile.major || 'No major'} · {profile.year ? `Year ${profile.year}` : 'No year'}
                    </span>
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          <div className={styles['sidebar-section']}>
            <button className={styles['sidebar-header']} onClick={() => navigate("/inbox")}>Inbox</button>
            <div className={styles['sidebar-content']}>
              {conversations.length > 0 ? (
                conversations.map((convo: any) => (
                  <div
                    key={convo.conversation_id}
                    className={styles['inbox-item']}
                    onClick={() => navigate(`/chat/${convo.conversation_id}`)}
                  >
                    <div className={styles['sidebar-avatar']}>
                      {convo.other_user_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className={styles['inbox-info']}>
                      <div className={styles['inbox-name']}>{convo.other_user_name}</div>
                    </div>
                    {convo.unread_count > 0 && (
                      <div className={styles['unread-badge']}>
                        {convo.unread_count}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p style={{fontSize: '12px', color: '#94a3b8'}}>No conversations yet.</p>
              )}
            </div>
          </div>
          <div className={styles['sidebar-section']}>
            <button className={styles['sidebar-header']} onClick={() => navigate("/forum")}>Forum</button>
            <div className={styles['sidebar-content']}>
              {uniqueModules.length > 0 ? (
                uniqueModules.map((code) => (
                  <div
                    key={code}
                    className={styles['inbox-item']}
                    onClick={() => navigate(`/forum/${code}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles['sidebar-avatar']} style={{ fontSize: '11px' }}>
                      {code.slice(0, 2)}
                    </div>
                    <div className={styles['inbox-info']}>
                      <div className={styles['inbox-name']}>{code}</div>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>›</span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Add modules to see forums.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Timetable;
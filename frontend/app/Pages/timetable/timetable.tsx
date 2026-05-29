import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './timetable.module.css'; 

interface Assignment {
  id: number;
  module: string;
  assignment_name: string;
  deadline: string; // Expecting a week indicator like "W1", "W2", etc.
}

function Timetable() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [moduleInput, setModuleInput] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // removes a module and all its associated assignments
  const handleRemoveModule = async (moduleCode: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/modules/${moduleCode}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAssignments(assignments.filter(task => task.module !== moduleCode));
      }
    } catch (error) {
      console.error("Error removing module:", error);
      setAssignments(assignments.filter(task => task.module !== moduleCode));
    }
  };

  // fetch all assigned data from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/timetable')
      .then(response => response.json())
      .then((data: Assignment[]) => setAssignments(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // adds the new module 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    try {
      const response = await fetch('http://localhost:8000/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_code: moduleInput }),
      });

      if (response.ok) {
        const newModuleAssignments: Assignment[] = await response.json();
        setAssignments([...assignments, ...newModuleAssignments]);
        setModuleInput('');
      }
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  // extracts the unique modules to create rows for the timetable
  const uniqueModules = Array.from(new Set(assignments.map(task => task.module)));

  // creates an array of W1-13 in uppercase
  const weeks = Array.from({ length: 13 }, (_, i) => `W${i + 1}`);

  const numModules = uniqueModules.length;

  const currentWeek = 'W0'; 
  const thisWeekCount = assignments.filter(
    task => task.deadline.toUpperCase() === currentWeek.toUpperCase()
  ).length;

  let peakWeek = 'N/A';
  let peakCount = 0;
  
  // count number of tasks in each week
  const weekCounts: Record<string, number> = {};
  assignments.forEach(task => {
    const dl = task.deadline.toUpperCase();
    if (!weekCounts[dl]) 
      weekCounts[dl] = 0;
    weekCounts[dl]++;
  });

  // finds the week with the most deadlines
  for (const [week, count] of Object.entries(weekCounts)) {
    if (count > peakCount) {
      peakCount = count;
      peakWeek = week;
    }
  }

  return (
    <div className={styles['timetable-page']}>
      <div className={styles['dashboard-container']}>
        
        <div className={styles.topbar}>
          <div className={styles['topbar-title']}>
            SyllaBuddy
          </div>
          <button className={styles['logout-btn']} onClick={handleLogout}>
            Sign out
          </button>
        </div>

        {/* Module Input Form */}
        <form onSubmit={handleSubmit} className={styles['module-form']}>
          <input 
            type="text" 
            placeholder="Enter Module Code" 
            value={moduleInput} 
            onChange={(e) => setModuleInput(e.target.value)} 
            required 
            className={styles['module-input']}
          />
          <button type="submit" className={styles['btn-add']}>Add Module</button>
        </form>

        {/* --- DASHBOARD CARDS --- */}
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

        <div className={styles['grid-wrapper']} style={{ overflowX: 'auto' }}>
          <div className={styles.grid} style={{ minWidth: '850px' }}>
            
            {/* creates headers of w1-13 */}
            <div className={styles['col-head']}></div>
            {weeks.map(week => (
              <div key={week} className={styles['col-head']}>{week}</div>
            ))}

            {/* creates a row for each module */}
            {uniqueModules.map(moduleCode => (
              <React.Fragment key={moduleCode}>
                
                {/* shows the module on the left column with a remove button */}
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

                {/* shows the assignments for each week */}
                {weeks.map(week => {
                  // Find if this module has a task matching this specific week
                  const tasksInWeek = assignments.filter(
                    task => task.module === moduleCode && task.deadline.toUpperCase() === week.toUpperCase()
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
    </div>
  );
}

export default Timetable;
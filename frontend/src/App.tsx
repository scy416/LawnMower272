import React, { useState, useEffect } from 'react';
import './App.css'; 

interface Assignment {
  id: number;
  module: string;
  assignment_name: string;
  deadline: string; // Expecting a week indicator like "W1", "W2", etc.
}

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [moduleInput, setModuleInput] = useState<string>('');

  // fetch all assigned data from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/timetable')
      .then(response => response.json())
      .then((data: Assignment[]) => setAssignments(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // adds the new module 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // doing it async js means that user can still navigate although the web is not updated
    e.preventDefault(); 
    try {
      const response = await fetch('http://localhost:8000/api/modules', {
        method: 'POST', // sending data to backend to create a new moddule assignment so it can give us all the details
        headers: { 'Content-Type': 'application/json' }, // tells the backend we're sending JSON data
        body: JSON.stringify({ module_code: moduleInput }), //flattens the module object into a simple JSON with just the module code
      });

      if (response.ok) {
        const newModuleAssignments: Assignment[] = await response.json();
        setAssignments([...assignments, ...newModuleAssignments]); // ... tellls tsx to empty out all the content of the object, to which setAssignments will append the new module's assignments
        setModuleInput(''); //clears the input field after successful submission
      }
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  // extracts the unique modules to create rows for the timetable
  const uniqueModules = Array.from(new Set(assignments.map(task => task.module))); // creates the rows

  // creates an array of w1-13
  const weeks = Array.from({ length: 13 }, (_, i) => `W${i + 1}`); // creates columns

  const numModules = uniqueModules.length;

  // 2. This Week's Deadlines
  // currentWeek to be coded in the future, will now just be w0 for testing purposes
  const currentWeek = 'W0'; 
  const thisWeekCount = assignments.filter(task => task.deadline === currentWeek).length;

  let peakWeek = 'N/A';
  let peakCount = 0;
  
  // count number of tasks in each week
  const weekCounts: Record<string, number> = {};
  assignments.forEach(task => {
    if (!weekCounts[task.deadline]) 
      weekCounts[task.deadline] = 0;
    weekCounts[task.deadline]++;
  });

  // finds the week with the most deadlines
  // const [week, count] is array deconsctruction, sets the first itme as week and the second item as count
  // Object.entries makes the object loopable, giving us an array of [week, count] pairs)
  for (const [week, count] of Object.entries(weekCounts)) {
    if (count > peakCount) {
      peakCount = count;
      peakWeek = week;
    }
  }

  // display
  return (
    <div className="wrap" style={{ padding: '20px' }}>
      <div className="topbar">
        <div>
          <div className="topbar-title">SYLLABUDDY</div>
        </div>
      </div>

      {/* Module Input Form */}
      <form onSubmit={handleSubmit} className="module-form">
        <input 
          type="text" 
          placeholder="Enter Module Code" 
          value={moduleInput} 
          onChange={(e) => setModuleInput(e.target.value)} 
          required 
          style={{ marginRight: '10px', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" className="btn">Add Module</button>
      </form>

      {/* --- DASHBOARD CARDS --- */}
      <div className="summary">
        
        <div className="scard">
          <div className="scard-label">This week</div>
          <div className="scard-val">{thisWeekCount}</div>
          <div className="scard-sub">deadlines</div>
        </div>

        <div className="scard">
          <div className="scard-label">Peak week</div>
          <div className="scard-val">{peakWeek}</div>
          <div className="scard-sub">{peakCount} deadlines</div>
        </div>

        <div className="scard">
          <div className="scard-label">Modules</div>
          <div className="scard-val">{numModules}</div>
          <div className="scard-sub">enrolled</div>
        </div>

      </div>


      <div style={{ overflowX: 'auto' }}>
        <div className="grid" style={{ minWidth: '700px' }}>
          
          {/* creates headers of w1-13 */}
          <div className="col-head"></div>
          {weeks.map(week => (
            <div key={week} className="col-head">{week}</div>
          ))}

          {/* creates a row for each module */}
          {uniqueModules.map(moduleCode => (
            <React.Fragment key={moduleCode}>
              
              {/* shows the module on the left column */}
              <div className="row-label">
                <span>{moduleCode}</span>
              </div>

              {/* shows the assignments for each week */}
              {weeks.map(week => {
                // Find if this module has a task matching this specific week
                const tasksInWeek = assignments.filter(
                  task => task.module === moduleCode && task.deadline === week
                );

                return (
                  <div key={week} className="cell">
                    {tasksInWeek.length > 0 && (
                      <div>
                        {tasksInWeek.map(task => (
                          <div key={task.id}>{task.assignment_name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

            </React.Fragment>
          ))}

        </div>
      </div>
    </div>
  );
}

export default App;
/**
 * Returns the current NUS semester week (1-13).
 * Returns 0 if we're in vacation / between semesters.
 * Sem 1: Aug 10 – ~Dec, Sem 2: Jan 11 – ~May
 */
export function getCurrentSemesterWeek(): number {
  const today = new Date();
  const year = today.getFullYear();
  const sem1Start = new Date(year, 7, 10);
  const sem2Start = new Date(year, 0, 11);

  let start: Date;
  if (today >= sem1Start) {
    start = sem1Start;
  } else if (today >= sem2Start) {
    start = sem2Start;
  } else {
    start = new Date(year - 1, 7, 10);
  }

  const days = Math.floor((today.getTime() - start.getTime()) / 86400000);
  const week = Math.floor(days / 7) + 1;
  return week >= 1 && week <= 13 ? week : 0;
}

export const fetchModuleSuggestions = async (query: string, token: string | null): Promise<string[]> => {
    if (!token) return [];
    
    const res = await fetch(`http://localhost:8000/api/search/modules?q=${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) return [];
    return await res.json();
};

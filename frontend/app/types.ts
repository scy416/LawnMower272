export interface Assignment {
  id: number;
  module_code: string;
  assignment_name: string;
  deadline: string;
}

export interface Profile {
  username: string;
  email: string;
  major: string | null;
  year: number | null;
  bio: string | null;
  modulesTaken?: string[];
  modulesToTake?: string[];
}

export interface Friend {
    id: number;
    username: string;
    major?: string;
    mutualFriends?: number;
}
export interface Assignment {
  id: number;
  module: string;
  assignment_name: string;
  deadline: string;
}

export interface Profile {
  username: string;
  email: string;
  major: string | null;
  year: number | null;
  bio: string | null;
}


export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  author: string;
  votes: number;
  voters: string[];
  createdAt: Date;
}

export interface VotingSession {
  id: string;
  isActive: boolean;
  timeRemaining: number;
  totalDuration: number;
}

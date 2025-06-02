
export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  votes: number;
  voters: string[];
  createdAt: Date;
}

export interface VotingSession {
  id: string;
  isActive: boolean;
  timeRemaining: number;
  totalDuration: number;
  hasEnded: boolean;
}

export interface Vote {
  id: string;
  ideaId: string;
  voterId: string;
  voterName: string;
  targetUserId: string;
  targetUserName: string;
  createdAt: Date;
}

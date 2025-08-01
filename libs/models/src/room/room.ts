export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  participants: Participant[];
}

export interface User {
  userId: string;
  name: string;
}

export interface Participant {
  user: User;
  joinedAt: Date;
  leftAt: Date | null;
}

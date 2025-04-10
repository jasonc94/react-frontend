export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  participants: Participant[];
}

export interface Participant {
  id: string;
  name: string;
  joinedAt: Date;
  leftAt: Date | null;
}

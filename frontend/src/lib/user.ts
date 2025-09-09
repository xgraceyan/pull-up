export type User = {
  id: string;
  name: string;
  passwordHash: string;
  eventId: string;
  createdAt: Date;
};

export type UserRaw = {
  id: string;
  name: string;
  passwordHash: string;
  eventId: string;
  createdAt: string;
};

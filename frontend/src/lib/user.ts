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

export type CreateUserForm = {
  name: string;
  password: string;
};

export type UserPayload = {
  name: string;
  passwordRaw: string;
  eventId: string;
};

export function getAllUsersFromId(userIds: string[], users: User[]): User[] {
  const idSet = new Set(userIds);
  return users.filter((user) => idSet.has(user.id));
}

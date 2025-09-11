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

export function getAllUsersFromId(userIds: string[], users: User[]): User[] {
  const idSet = new Set(userIds);
  return users.filter((user) => idSet.has(user.id));
}

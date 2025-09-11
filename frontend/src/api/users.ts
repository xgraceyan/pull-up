import type { DayOfWeek } from "@/lib/calendar";
import type { CreateUserForm, User, UserPayload, UserRaw } from "@/lib/user";
import { apiFetch } from "./apiUtils";

export async function createUser(
  eventId: string,
  user: CreateUserForm
): Promise<User> {
  const userPayload: UserPayload = {
    name: user.name,
    passwordRaw: user.password,
    eventId,
  };

  return await apiFetch(
    "/users/create",
    {
      method: "POST",
      body: JSON.stringify(userPayload),
    },
    "Failed to create user"
  );
}

export async function loginUser(
  eventId: string,
  name: string,
  passwordRaw: string
): Promise<User> {
  const userPayload = {
    name,
    passwordRaw,
  };
  return await apiFetch(
    `/users/event/${eventId}/login`,
    {
      method: "POST",
      body: JSON.stringify(userPayload),
    },
    "Failed to login user"
  );
}

export async function fetchUsersByWeekDayTime(
  eventId: string,
  weekDay: DayOfWeek,
  startTime: string,
  endTime: string
): Promise<User[]> {
  const params = new URLSearchParams({
    weekDay,
    startTime,
    endTime,
  });
  const raw_users: UserRaw[] = await apiFetch(
    `/timeslots/event/${eventId}/weekdaytime/users?${params.toString()}`,
    { method: "GET" },
    "Failed to fetch time slot users"
  );

  return raw_users.map((raw_user: UserRaw) => ({
    ...raw_user,
    createdAt: new Date(raw_user.createdAt),
  }));
}

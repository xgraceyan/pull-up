import type { DayOfWeek } from "@/lib/calendar";
import type { CreateUserForm, User, UserPayload, UserRaw } from "@/lib/user";

export async function createUser(
  eventId: string,
  user: CreateUserForm
): Promise<User> {
  const userPayload: UserPayload = {
    name: user.name,
    passwordRaw: user.password,
    eventId,
  };
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userPayload),
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(`Failed to create user: ${errorMessage}`);
  }

  return await res.json();
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
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/timeslots/event/${eventId}/weekdaytime/users?${params.toString()}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch time slot users");
  }

  const raw_users: UserRaw[] = await res.json();

  return raw_users.map((raw_user: UserRaw) => ({
    ...raw_user,
    createdAt: new Date(raw_user.createdAt),
  }));
}

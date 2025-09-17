import {
  fetchAllEventTimeSlots,
  fetchAllFromUser,
  setTimeSlots,
} from "@/api/timeslots";
import { fetchUsersByWeekDayTime } from "@/api/users";
import type { DayOfWeek } from "@/lib/calendar";
import type { Event, EventType } from "@/lib/event";
import { type TimeSlot, type TimeSlotPayload } from "@/lib/timeslot";
import { type User } from "@/lib/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTimeSlot<T extends EventType>(event?: Event & { type: T }) {
  return useQuery<TimeSlot<T>[]>({
    queryKey: ["timeslot", event],
    queryFn: () => fetchAllEventTimeSlots(event!),
    enabled: !!event,
  });
}

export function useUsersByWeekDayTime(
  eventId: string,
  weekDay: DayOfWeek,
  startTime: string,
  endTime: string
) {
  return useQuery<User[]>({
    queryKey: ["usersByWeekDayTime", eventId, weekDay, startTime, endTime],
    queryFn: () =>
      fetchUsersByWeekDayTime(eventId, weekDay, startTime, endTime),
    enabled: !!eventId && !!startTime && !!endTime,
  });
}

export function useTimeSlotByUser<T extends EventType>(
  event: Event & { type: T },
  userId?: string
) {
  return useQuery<TimeSlot<T>[]>({
    queryKey: ["timeslotByUser", event, userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchAllFromUser(event, userId);
    },
    enabled: !!event && !!userId,
  });
}

export function useSetTimeSlots(event: Event, userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timeSlots: TimeSlotPayload[]) =>
      setTimeSlots(event.id, userId, timeSlots),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeslot", event],
      });
    },
    onError: (error) => {
      // Handle errors
      console.error("Set timeslots failed:", error);
    },
  });
}

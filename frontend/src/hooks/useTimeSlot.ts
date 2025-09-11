import {
  fetchAllEventTimeSlots,
  fetchAllFromUser,
  setTimeSlots,
} from "@/api/timeslots";
import { fetchUsersByWeekDayTime } from "@/api/users";
import type { DayOfWeek } from "@/lib/calendar";
import { type TimeSlot, type TimeSlotPayload } from "@/lib/timeslot";
import { type User } from "@/lib/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTimeSlot(eventId?: string) {
  return useQuery<TimeSlot[]>({
    queryKey: ["timeslot", eventId],
    queryFn: () => fetchAllEventTimeSlots(eventId!),
    enabled: !!eventId,
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

export function useTimeSlotByUser(eventId: string, userId?: string) {
  return useQuery<TimeSlot[]>({
    queryKey: ["timeslotByUser", eventId, userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchAllFromUser(eventId, userId);
    },
    enabled: !!eventId && !!userId,
  });
}

export function useSetTimeSlots(eventId: string, userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timeSlots: TimeSlotPayload[]) =>
      setTimeSlots(eventId, userId, timeSlots),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["timeslot", eventId],
      });
    },
    onError: (error) => {
      // Handle errors
      console.error("Set timeslots failed:", error);
    },
  });
}

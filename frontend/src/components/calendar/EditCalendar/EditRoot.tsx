import type { Event } from "@/lib/event";
import { EditCalendar } from "./EditCalendar";
import type { User } from "@/lib/user";
import { useSetTimeSlots, useTimeSlotByUser } from "@/hooks/useTimeSlot";
import { useEffect, useState } from "react";
import { type TimeSlotEvent } from "@/lib/calendar";
import {
  convertToPayloadTimeslots,
  loadTimeSlotToCalendar,
} from "@/lib/timeslot";
import { Button } from "@/components/ui/button";
import { useSessionState } from "@/hooks/useSessionState";

interface EditRootProps {
  event: Event;
  user: User;
  setEditUser: (value: React.SetStateAction<User | null>) => void;
}

export const EditRoot = ({ event, user, setEditUser }: EditRootProps) => {
  const {
    data: timeSlots,
    isLoading: slotsLoading,
    error: slotsError,
  } = useTimeSlotByUser(event.id, user?.id);

  const useSetTimeSlotMutation = useSetTimeSlots(event.id, user.id);

  const [currTimeSlots, setCurrTimeSlots] = useSessionState<
    TimeSlotEvent[] | null
  >(`timeslots-${user.id}`, null);

  useEffect(() => {
    if (timeSlots && (!currTimeSlots || currTimeSlots.length == 0)) {
      setCurrTimeSlots(loadTimeSlotToCalendar(timeSlots));
    }
  }, [timeSlots]);

  useEffect(() => {
    // Clear session storage on page refresh
    const handleUnload = () => {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("timeslots-")) {
          sessionStorage.removeItem(key);
        }
      });
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!currTimeSlots) return;
    const payloadTimeSlots = convertToPayloadTimeslots(
      event,
      user,
      currTimeSlots
    );
    try {
      await useSetTimeSlotMutation.mutate(payloadTimeSlots);
      setEditUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditUser(null);
  };

  if (slotsLoading) return <p>Loading...</p>;
  if (slotsError) return <p>{slotsError.message}</p>;
  if (!event) return <p>No event</p>;

  return (
    <div className="grid grid-cols-3 gap-4 text-center p-10">
      <div className="col-span-2">
        <EditCalendar
          event={event}
          user={user}
          currTimeSlots={currTimeSlots ?? []}
          setCurrTimeSlots={setCurrTimeSlots}
        />
      </div>
      <div className="col-span-1">
        <h1 className="text-bold">Editing</h1>
        <Button style={{ cursor: "pointer" }} onClick={handleSubmit}>
          Submit
        </Button>
        <Button
          variant="outline"
          style={{ cursor: "pointer" }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

import type { Event } from "@/lib/event";
import { EditCalendar } from "./EditCalendar";
import type { User } from "@/lib/user";
import { useSetTimeSlots, useTimeSlotByUser } from "@/hooks/useTimeSlot";
import { useEffect } from "react";
import { type TimeSlotEvent } from "@/lib/calendar";
import {
  convertToPayloadTimeslots,
  loadTimeSlotToCalendar,
} from "@/lib/timeslot";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { handleSessionClear, useSessionState } from "@/hooks/useSessionState";
import { useDeleteUser } from "@/hooks/useUser";

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

  const useDeleteUserMutation = useDeleteUser(event, setEditUser);

  // Use session storage, because selection clears when page is tabbed out.
  const [currTimeSlots, setCurrTimeSlots] = useSessionState<
    TimeSlotEvent[] | null
  >(`timeslots-${user.id}`, null);

  useEffect(() => {
    if (timeSlots && !currTimeSlots) {
      setCurrTimeSlots(loadTimeSlotToCalendar(timeSlots));
    }
  }, [timeSlots]);

  useEffect(() => {
    // Clear session storage on page refresh
    const handleUnload = () => {
      handleSessionClear("timeslots-");
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const handleSubmit = () => {
    if (!currTimeSlots) return;
    const payloadTimeSlots = convertToPayloadTimeslots(
      event,
      user,
      currTimeSlots
    );
    try {
      useSetTimeSlotMutation.mutate(payloadTimeSlots);
      setEditUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditUser(null);
    handleSessionClear(`timeslots-${user.id}`);
  };

  const handleDeleteUser = () => {
    useDeleteUserMutation.mutate(user.id);
    handleSessionClear(`timeslots-${user.id}`);
  };

  const handleClear = () => {
    setCurrTimeSlots([]);
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
      <div className="col-span-1 flex flex-col gap-5">
        <div>
          <h1 className="font-semibold text-lg">Editing {user.name}</h1>
          <p className="text-sm text-gray-500">
            Click or drag to select and deselect availability
          </p>
        </div>
        <div className="flex gap-5 flex-col lg:px-10 md:px-3">
          <Button className="flex-1" variant="secondary" onClick={handleClear}>
            Clear selection
          </Button>
          <div className="flex flex-1 gap-3">
            <Button className="flex-1" onClick={handleSubmit}>
              Submit
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
          <Separator className="my-3" />
          <Button variant="destructiveOutline" onClick={handleDeleteUser}>
            Delete user
          </Button>
        </div>
      </div>
    </div>
  );
};

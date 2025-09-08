import { useEvent } from "@/hooks/useEvent";
import { useParams } from "react-router-dom";
import { WeekDayTimeCalendar } from "../calendar/WeekDayTimeCalendar/WeekDayTimeCalendar";

export function Event() {
  const { urlAlias } = useParams();
  const { data: event, isLoading, error } = useEvent(urlAlias);

  console.log(event);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!event) return <p>No event</p>;
  return (
    <div className="flex flex-col h-screen pt-10">
      <p className="text-lg font-medium text-center">{event.name}</p>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="col-span-2 p-10">
          <WeekDayTimeCalendar event={event} />
        </div>
        <div className="col-span-1">Hi</div>
      </div>
    </div>
  );
}

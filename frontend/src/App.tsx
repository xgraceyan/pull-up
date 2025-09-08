import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link, Route, Routes } from "react-router-dom";
import { WeekDayTimeCalendar } from "./components/calendar/WeekDayTimeCalendar/WeekDayTimeCalendar";
import { Event } from "./components/event/Event";

async function fetchHello() {
  return new Promise<string>((resolve) =>
    setTimeout(() => resolve("TanStack Test"), 500)
  );
}

export default function App() {
  // const { data, isLoading } = useQuery({
  //   queryKey: ["hello"],
  //   queryFn: fetchHello,
  // });

  return (
    <Routes>
      <Route path="/event/:urlAlias" element={<Event />} />
    </Routes>
    // <div className="flex flex-col h-screen pt-10">
    //   <p className="text-lg font-medium text-center">
    //     {isLoading ? "Loading..." : data}
    //   </p>
    //   <div className="grid grid-cols-3 gap-4 text-center">
    //     <div className="col-span-2 p-10">
    //       {/* <CalendarRoot /> */}
    //       <WeekDayTimeCalendar />
    //     </div>
    //     <div className="col-span-1">Hi</div>
    //   </div>
    // </div>
  );
}

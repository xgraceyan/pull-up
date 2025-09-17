import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeekDayTimeForm } from "./WeekDayTimeForm";
import { DayTimeForm } from "./DayTimeForm";
import { DayForm } from "./DayForm";

export const CreateEventForm = () => {
  return (
    <div className="flex w-full max-w-md flex-col">
      <Card>
        <Tabs defaultValue="weekdayTime">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="weekdayTime">Weekly</TabsTrigger>
              <TabsTrigger value="dayTime">Day/Time</TabsTrigger>
              <TabsTrigger value="day">Day Only</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-col gap-4">
            <TabsContent value="weekdayTime">
              <WeekDayTimeForm />
            </TabsContent>
            <TabsContent value="dayTime">
              <DayTimeForm />
            </TabsContent>
            <TabsContent value="day">
              <DayForm />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

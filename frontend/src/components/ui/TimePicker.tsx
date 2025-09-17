import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { type Control } from "react-hook-form";

interface TimePickerProps {
  control: Control<any>;
  name: string;
  label: string;
}

export function TimePicker({ control, name, label }: TimePickerProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        function handleTimeChange(
          type: "hour" | "minute" | "ampm",
          value: string
        ) {
          const currentDate = field.value
            ? new Date(field.value)
            : new Date().setMinutes(0, 0, 0);
          let newDate = new Date(currentDate);

          if (type === "hour") {
            const hour = parseInt(value, 10);
            newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
          } else if (type === "minute") {
            newDate.setMinutes(parseInt(value, 10));
          } else if (type === "ampm") {
            const hours = newDate.getHours();
            if (value === "AM" && hours >= 12) {
              newDate.setHours(hours - 12);
            } else if (value === "PM" && hours < 12) {
              newDate.setHours(hours + 12);
            }
          }

          field.onChange(newDate);
        }

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      moment(field.value).format("hh:mm A")
                    ) : (
                      <span>hh:mm aa</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                  <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (hour) => (
                            <Button
                              key={hour}
                              size="icon"
                              variant={
                                field.value &&
                                field.value.getHours() % 12 === hour % 12
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() =>
                                handleTimeChange("hour", hour.toString())
                              }
                            >
                              {hour}
                            </Button>
                          )
                        )}
                      </div>
                      <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                      />
                    </ScrollArea>

                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {[0, 30].map((minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            variant={
                              field.value && field.value.getMinutes() === minute
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() =>
                              handleTimeChange("minute", minute.toString())
                            }
                          >
                            {minute.toString().padStart(2, "0")}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                      />
                    </ScrollArea>

                    <ScrollArea>
                      <div className="flex sm:flex-col p-2">
                        {["AM", "PM"].map((ampm) => (
                          <Button
                            key={ampm}
                            size="icon"
                            variant={
                              field.value &&
                              ((ampm === "AM" && field.value.getHours() < 12) ||
                                (ampm === "PM" && field.value.getHours() >= 12))
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => handleTimeChange("ampm", ampm)}
                          >
                            {ampm}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

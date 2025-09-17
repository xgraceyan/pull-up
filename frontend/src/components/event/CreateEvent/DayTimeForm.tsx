import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TimePicker } from "@/components/ui/TimePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkEventUrlExists } from "@/api/events";
import {
  baseFormDefaultValues,
  BaseFormFields,
  BaseFormHeader,
  baseFormSchemaFields,
} from "./BaseForm";
import { DatePicker } from "@/components/ui/DatePicker";
import { useNavigate } from "react-router-dom";
import { useCreateEvent } from "@/hooks/useEvent";
import { convertToEventPayload } from "@/lib/event";

const FormSchema = z
  .object({
    ...baseFormSchemaFields,
    startDate: z.date({
      error: () => ({ message: "Start date is required." }),
    }),
    endDate: z.date({
      error: () => ({ message: "End date is required." }),
    }),
    startTime: z.date({
      error: () => "Start time is required.",
    }),
    endTime: z.date({
      error: () => "End time is required.",
    }),
  })
  .refine((data) => data.startDate < data.endDate, {
    path: ["endDate"],
    message: "End date must be after start date.",
  })
  .refine((data) => data.startTime < data.endTime, {
    path: ["endTime"],
    message: "End time must be after start time.",
  });

export const DayTimeForm = () => {
  const navigate = useNavigate();
  const useCreateEventMutation = useCreateEvent();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...baseFormDefaultValues,
      startDate: undefined,
      endDate: undefined,
      startTime: undefined,
      endTime: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const eventPayload = convertToEventPayload("dayTime", values);
    try {
      useCreateEventMutation.mutate(eventPayload, {
        onSuccess: (event) => {
          navigate(`/event/${event.urlAlias}`);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-4 flex-col"
      >
        <BaseFormHeader
          title="Day and Time Event"
          description="Schedule an event in a specific day and time range."
        />

        <CardContent className="grid gap-4">
          <BaseFormFields control={form.control} />

          <div className="flex items-start gap-2">
            <div className="w-1/2 flex flex-col">
              <DatePicker
                label="Start Date"
                control={form.control}
                name="startDate"
              />
            </div>
            <div className="w-1/2 flex flex-col">
              <DatePicker
                label="End Date"
                control={form.control}
                name="endDate"
              />
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-1/2 flex flex-col">
              <TimePicker
                label="Start Time"
                control={form.control}
                name="startTime"
              />
            </div>
            <div className="w-1/2 flex flex-col">
              <TimePicker
                label="End Time"
                control={form.control}
                name="endTime"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Create event
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

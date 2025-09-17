import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { TimePicker } from "@/components/ui/TimePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  baseFormDefaultValues,
  BaseFormFields,
  BaseFormHeader,
  baseFormSchemaFields,
} from "./BaseForm";
import { useCreateEvent } from "@/hooks/useEvent";
import { convertToEventPayload } from "@/lib/event";
import { useNavigate } from "react-router-dom";

const FormSchema = z
  .object({
    ...baseFormSchemaFields,
    startTime: z.date({
      error: () => "Start time is required.",
    }),
    endTime: z.date({
      error: () => "End time is required.",
    }),
  })
  .refine((data) => data.startTime < data.endTime, {
    path: ["endTime"],
    message: "End time must be after start time.",
  });

export const WeekDayTimeForm = () => {
  const navigate = useNavigate();
  const useCreateEventMutation = useCreateEvent();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...baseFormDefaultValues,
      startTime: undefined,
      endTime: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const eventPayload = convertToEventPayload("weekdayTime", values);
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
          title="Weekly Event"
          description="Schedule an event occurring every week."
        />

        <CardContent className="grid gap-4">
          <BaseFormFields control={form.control} />

          <div className="flex items-start gap-2">
            <div className="w-1/2 flex flex-col">
              <TimePicker
                label="Start Time"
                control={form.control}
                name="startTime"
              />
              {/* pad out error message */}
              <div className="h-5"></div>
            </div>
            <div className="w-1/2 flex flex-col">
              <TimePicker
                label="End Time"
                control={form.control}
                name="endTime"
              />
              <div className="h-5"></div>
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

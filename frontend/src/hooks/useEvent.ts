import {
  checkEventUrlExists,
  createEvent,
  fetchEventFromUrl,
} from "@/api/events";
import { type Event, type EventPayload, type EventType } from "@/lib/event";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useEvent(urlAlias?: string) {
  return useQuery<Event>({
    queryKey: ["event", urlAlias],
    queryFn: () => fetchEventFromUrl(urlAlias!),
    enabled: !!urlAlias,
  });
}

export function useEventUrlExists(urlAlias: string) {
  return useQuery<boolean>({
    queryKey: ["eventUrlExists", urlAlias],
    queryFn: () => checkEventUrlExists(urlAlias),
    enabled: !!urlAlias,
  });
}

export function useCreateEvent() {
  return useMutation({
    mutationFn: (event: EventPayload) => {
      return createEvent(event);
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

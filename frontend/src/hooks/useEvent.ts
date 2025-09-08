import { fetchEventFromUrl } from "@/api/events";
import { type Event } from "@/lib/event";
import { useQuery } from "@tanstack/react-query";

export function useEvent(urlAlias?: string) {
  return useQuery<Event>({
    queryKey: ["event", urlAlias],
    queryFn: () => fetchEventFromUrl(urlAlias!),
    enabled: !!urlAlias,
  });
}

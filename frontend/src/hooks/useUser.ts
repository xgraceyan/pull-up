import { createUser } from "@/api/users";
import type { Event } from "@/lib/event";
import type { CreateUserForm } from "@/lib/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateUser(event: Event) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: CreateUserForm) => {
      return createUser(event.id, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", event.urlAlias],
      });
    },
    onError: (error) => {
      console.error("Create user failed:", error);
    },
  });
}

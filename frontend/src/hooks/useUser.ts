import { createUser, loginUser } from "@/api/users";
import type { Event } from "@/lib/event";
import type { CreateUserForm, User } from "@/lib/user";
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

export function useLoginUser(
  eventId: string,
  setEditUser: (value: React.SetStateAction<User | null>) => void
) {
  return useMutation({
    mutationFn: ({
      name,
      passwordRaw,
    }: {
      name: string;
      passwordRaw: string;
    }) => {
      return loginUser(eventId, name, passwordRaw);
    },
    onSuccess: (user: User) => {
      setEditUser(user);
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
}

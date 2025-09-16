import { createUser, deleteUser, loginUser } from "@/api/users";
import type { Event } from "@/lib/event";
import type { User, UserPayload } from "@/lib/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateUser(event: Event) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: UserPayload) => {
      return createUser(event.id, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", event.urlAlias],
      });
    },
    onError: (error) => {
      console.error(error);
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
      return loginUser(eventId, { name, passwordRaw });
    },
    onSuccess: (user: User) => {
      setEditUser(user);
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
}

export function useDeleteUser(
  event: Event,
  setEditUser: (value: React.SetStateAction<User | null>) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      return deleteUser(event.id, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", event.urlAlias],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeslot", event],
      });
      setEditUser(null);
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

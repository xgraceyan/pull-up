import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "@/hooks/useUser";
import type { Event } from "@/lib/event";
import type { CreateUserForm, User } from "@/lib/user";
import { useState } from "react";

interface CreateUserDialogProps {
  event: Event;
  setEditUser: (value: React.SetStateAction<User | null>) => void;
}

export const CreateUserDialog = ({
  event,
  setEditUser,
}: CreateUserDialogProps) => {
  const [formData, setFormData] = useState<CreateUserForm>({
    name: "",
    password: "",
  });

  const useCreateUserMutation = useCreateUser(event);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      useCreateUserMutation.mutate(formData, {
        onSuccess: (newUser) => {
          setEditUser(newUser);
        },
      });
      setFormData({ name: "", password: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Add your availability to the calendar
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4 mb-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" onChange={handleChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password (optional)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Leave blank for no password"
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

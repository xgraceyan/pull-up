import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginUser } from "@/hooks/useUser";
import type { User } from "@/lib/user";
import { useState } from "react";

interface LoginDialogProps {
  user: User;
  eventId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setEditUser: (value: React.SetStateAction<User | null>) => void;
}

export const LoginDialog = ({
  user,
  eventId,
  open,
  setOpen,
  setEditUser,
}: LoginDialogProps) => {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const useLoginUserMutation = useLoginUser(eventId, setEditUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await useLoginUserMutation.mutateAsync({
        name: user.name,
        passwordRaw: password,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Schedule as {user.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4 mb-6">
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password here"
                  onChange={handleChange}
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Log In</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

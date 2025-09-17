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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface GoToEventDialogProps {
  dialogTrigger: React.ReactNode;
}

export const GoToEventDialog = ({ dialogTrigger }: GoToEventDialogProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [urlAlias, setUrlAlias] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("change");

    setUrlAlias(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
    navigate(`/event/${urlAlias}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Go to Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="urlAlias">Event URL name</Label>
              <Input
                id="urlAlias"
                name="urlAlias"
                placeholder="my-meeting"
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

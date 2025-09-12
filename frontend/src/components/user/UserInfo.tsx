import type { User } from "@/lib/user";
import { Button } from "../ui/button";

import { CreateUserDialog } from "./CreateUserDialog";
import type { Event } from "@/lib/event";
import { useState } from "react";
import { LoginDialog } from "./LoginDialog";

interface UserInfoProps {
  event: Event;
  users: User[];
  setEditUser: (value: React.SetStateAction<User | null>) => void;
}

export const UserInfo = ({ event, users, setEditUser }: UserInfoProps) => {
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<User | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {loginUser && (
        <LoginDialog
          user={loginUser}
          eventId={event.id}
          open={loginOpen}
          setOpen={setLoginOpen}
          setEditUser={setEditUser}
        />
      )}
      <div>
        <h1 className="font-semibold text-lg">Users</h1>
        <p className="text-sm text-gray-500">
          Click to edit individual availability
        </p>
      </div>
      <div className="">
        {users.map((user) => (
          <div className="px-1" key={user.id}>
            <Button
              variant="link"
              className="text-gray-850 font-medium text-md"
              onClick={(e) => {
                e.preventDefault();
                if (user.passwordHash.length > 0) {
                  setLoginOpen(true);
                  setLoginUser(user);
                } else {
                  setEditUser(user);
                }
              }}
            >
              {user.name}
            </Button>
          </div>
        ))}
      </div>

      <div className="px-10">
        <CreateUserDialog event={event} setEditUser={setEditUser} />
      </div>
    </div>
  );
};

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
    <div>
      {loginUser && (
        <LoginDialog
          user={loginUser}
          eventId={event.id}
          open={loginOpen}
          setOpen={setLoginOpen}
          setEditUser={setEditUser}
        />
      )}
      <h1 className="font-bold">Users</h1>
      {users.map((user) => (
        <div className="p-2" key={user.id}>
          <a
            href=""
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
          </a>
        </div>
      ))}
      <div className="m-2">
        <CreateUserDialog event={event} setEditUser={setEditUser} />
      </div>
    </div>
  );
};

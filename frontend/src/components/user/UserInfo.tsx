import type { User } from "@/lib/user";
import { Button } from "../ui/button";
import { CreateUserDialog } from "./CreateUserDialog";
import type { Event } from "@/lib/event";

interface UserInfoProps {
  event: Event;
  users: User[];
  setEditUser: (value: React.SetStateAction<User | null>) => void;
}

export const UserInfo = ({ event, users, setEditUser }: UserInfoProps) => {
  return (
    <div>
      <h1 className="font-bold">Users</h1>
      {users.map((user) => (
        <div className="p-2" key={user.id}>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              setEditUser(user);
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

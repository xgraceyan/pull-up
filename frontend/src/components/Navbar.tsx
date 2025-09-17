import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { GoToEventDialog } from "./event/GoToEventDialog";

export const Navbar = () => {
  return (
    <div className="flex px-10 fixed top-0 left-0 w-full bg-transparent z-10">
      <NavigationMenu className="flex flex-row my-2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className="font-bold text-md">
              Pull Up
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu className="flex ml-auto justify-end my-2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
          <GoToEventDialog
            dialogTrigger={
              <NavigationMenuItem>
                <NavigationMenuLink className="cursor-pointer">
                  Go To Event
                </NavigationMenuLink>
              </NavigationMenuItem>
            }
          />
          <NavigationMenuItem>
            <NavigationMenuLink
              href="https://github.com/xgraceyan/pull-up"
              target="_blank"
            >
              GitHub
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

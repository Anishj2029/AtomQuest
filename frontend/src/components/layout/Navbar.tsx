import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SearchBar } from "@/components/shared/SearchBar";
import type { UserRole } from "@/types";

const roleSettingsPath: Record<UserRole, string> = {
  employee: "/employee/profile",
  manager: "/manager",
  admin: "/admin/settings",
};

const roleProfilePath: Record<UserRole, string> = {
  employee: "/employee/profile",
  manager: "/manager",
  admin: "/admin",
};

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role as UserRole | undefined;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-zinc-200/80 bg-white/70 px-6 backdrop-blur-xl">
      <SearchBar placeholder="Search goals, people, cycles..." className="max-w-md flex-1" />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600" />
        </button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-zinc-100 outline-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-medium text-white">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
              <p className="text-xs text-zinc-500">{user?.title}</p>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[200px] rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
              sideOffset={8}
              align="end"
            >
              <DropdownMenu.Item 
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-zinc-100"
                onSelect={() => navigate(role ? roleProfilePath[role] : "/login")}
              >
                <User className="h-4 w-4" /> Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-zinc-100"
                onSelect={() => navigate(role ? roleSettingsPath[role] : "/login")}
              >
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-zinc-100" />
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50"
                onSelect={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}

"use client"

import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import {
  BadgeCheck,
  ChevronUp,
  ScanLine,
  LogOut,
  Building2,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // 🔥 delete cookies
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // ♻️ invalidate auth state
    queryClient.invalidateQueries({ queryKey: ["me"] });

    // 🚪 redirect
    navigate({ to: "/login" });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="group">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg text-black">
                  OG
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>

              <ChevronUp className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:rotate-180 md:group-data-[state=open]:rotate-90" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-md bg-chart-3"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-white">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-chart-5" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="group !text-white hover:!text-black hover:bg-accent hover:cursor-pointer"
                onClick={() => navigate({ to: "/profile" })}
              >
                <BadgeCheck className="!stroke-current group-hover:!text-black" />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-chart-5" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="group !text-white hover:!text-black hover:bg-accent hover:cursor-pointer"
                onClick={() => navigate({ to: "/scanners" })}
              >
                <ScanLine className="!stroke-current group-hover:!text-black" />
                Scanner
              </DropdownMenuItem>

              <DropdownMenuItem
                className="group !text-white hover:!text-black hover:bg-accent hover:cursor-pointer"
                onClick={() => navigate({ to: "/organization" })}
              >
                <Building2 className="!stroke-current group-hover:!text-black" />
                Organization
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-chart-5" />

            <DropdownMenuItem
              className="group !text-white hover:!text-black hover:bg-accent hover:cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="!stroke-current group-hover:!text-black" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

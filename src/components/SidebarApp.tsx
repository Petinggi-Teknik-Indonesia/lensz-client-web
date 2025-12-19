import {
  Glasses,
  Home,
  Sheet,
  ChevronRight,
  Tag,
  Factory,
  QrCode,
  UserCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllDrawers } from "@/api/drawers";
import { NavUser } from "./UserProfile";
import { getMe } from "@/api/auth";

const generalItems = [{ title: "Dashboard", url: "/dashboard", icon: Home }];

const glassesItems = [
  { title: "Eyeglasses", url: "/eyeglasses", icon: Glasses },
  { title: "Brands", url: "/brands", icon: Tag },
  { title: "Companies", url: "/companies", icon: Factory },
];

const managementItems = [
  { title: "Add Drawer", url: "/drawers-table", icon: Sheet },
];

export function SidebarApp() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  // 🔐 ADMIN CHECK (DO NOT TOUCH SCANNER LOGIC)
  const isAdmin = me?.role?.ID === 1 || me?.role?.ID === 2;

  const {
    data: drawers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["drawers"],
    queryFn: getAllDrawers,
  });

  const uniqueDrawers =
    drawers && drawers.length > 0
      ? [...new Map(drawers.map((d: any) => [d.name, d]))]
          .map(([_, d]) => d)
          .sort((a, b) => a.name.localeCompare(b.name))
      : [];

  return (
    <Sidebar>
      <SidebarContent className="bg-[#0138C8] text-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* ================= GENERAL ================= */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => {
                const isActive = currentPath.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 transition-colors ${
                          isActive
                            ? "bg-[#B1F70B] text-black"
                            : "hover:bg-[#B1F70B] hover:text-black"
                        }`}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ================= GLASSES ================= */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Glasses</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {glassesItems.map((item) => {
                const isActive = currentPath.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 transition-colors ${
                          isActive
                            ? "bg-[#B1F70B] text-black"
                            : "hover:bg-[#B1F70B] hover:text-black"
                        }`}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ================= MANAGEMENT ================= */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Sheet size={18} />
                        <span>Drawers</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {isLoading && (
                        <SidebarMenuSubItem>Loading...</SidebarMenuSubItem>
                      )}
                      {isError && (
                        <SidebarMenuSubItem className="text-red-300">
                          Failed to load drawers
                        </SidebarMenuSubItem>
                      )}
                      {uniqueDrawers.map((drawer: any) => {
                        const url = `/drawers/${drawer.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`;
                        return (
                          <SidebarMenuSubItem key={drawer.name}>
                            <SidebarMenuButton asChild>
                              <Link to={url}>{drawer.name}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ================= ADMIN (NEW, SAFE ADDITION) ================= */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-white">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/adminUser"
                      className={`flex items-center gap-2 rounded-md px-2 py-1 transition-colors ${
                        currentPath.startsWith("/admin.users")
                          ? "bg-[#B1F70B] text-black"
                          : "hover:bg-[#B1F70B] hover:text-black"
                      }`}
                    >
                      <UserCheck size={18} />
                      <span>Verify Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* ================= PROFILE ================= */}
        <SidebarGroup className="mt-auto">
          <NavUser
            user={{
              name: me?.name || "User",
              email: me?.email || "",
              avatar: "/avatars/shadcn.jpg",
            }}
          />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

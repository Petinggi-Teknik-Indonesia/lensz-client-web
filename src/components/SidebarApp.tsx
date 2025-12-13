import {
  ArrowLeftIcon,
  Glasses,
  Home,
  PersonStandingIcon,
  Sheet,
  ChevronRight,
  Tag,
  Factory,
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

const generalItems = [{ title: "Dashboard", url: "/dashboard", icon: Home }];

const glassesItems = [
  { title: "Eyeglasses", url: "/eyeglasses", icon: Glasses },
  { title: "Brands", url: "/brands", icon: Tag },
  { title: "Companies", url: "/companies", icon: Factory },
];

const managementItems = [
  { title: "Add Drawer", url: "/drawers-table", icon: Sheet },
];

const profileItems = [
  { title: "Profile", url: "/profile", icon: PersonStandingIcon },
  { title: "Logout", url: "/logout", icon: ArrowLeftIcon },
  { title: "Test", url: "/test", icon: Sheet },
];

export function SidebarApp() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // ✅ Fetch drawers dynamically
  const { data: drawers, isLoading, isError } = useQuery({
    queryKey: ["drawers"],
    queryFn: getAllDrawers,
  });

  // ✅ Remove duplicates by drawer name + sort
  const uniqueDrawers =
    drawers && drawers.length > 0
      ? [...new Map(drawers.map((d: any) => [d.name, d]))]
          .map(([_, d]) => d)
          .sort((a, b) => a.name.localeCompare(b.name))
      : [];

  return (
    <Sidebar>
      <SidebarContent className="bg-[#0138C8] text-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* General */}
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
                        } ${isActive ? "pointer-events-none" : ""}`}
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

        {/* Glasses */}
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
                        } ${isActive ? "pointer-events-none" : ""}`}
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

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Collapsible Drawers Section */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between gap-2 w-full">
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

                  <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub>
                      {isLoading && (
                        <SidebarMenuSubItem>
                          <span className="px-2 py-1 text-sm">Loading...</span>
                        </SidebarMenuSubItem>
                      )}
                      {isError && (
                        <SidebarMenuSubItem>
                          <span className="px-2 py-1 text-sm text-red-300">
                            Failed to load drawers
                          </span>
                        </SidebarMenuSubItem>
                      )}

                      {uniqueDrawers.length > 0 ? (
                        uniqueDrawers.map((drawer: any) => {
                          const url = `/drawers/${drawer.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`;
                          const isActive = currentPath.startsWith(url);

                          return (
                            <SidebarMenuSubItem key={drawer.name}>
                              <SidebarMenuButton asChild>
                                <Link
                                  to={url}
                                  className={`flex items-center gap-2 rounded-md px-2 py-1 transition-colors ${
                                    isActive
                                      ? "bg-[#B1F70B] text-black"
                                      : "hover:bg-[#B1F70B] hover:text-black"
                                  } ${isActive ? "pointer-events-none" : ""}`}
                                >
                                  <span>{drawer.name}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          );
                        })
                      ) : (
                        !isLoading && (
                          <SidebarMenuSubItem>
                            <span className="px-2 py-1 text-sm opacity-75">
                              No drawers found
                            </span>
                          </SidebarMenuSubItem>
                        )
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Other Management Items */}
              {managementItems.map((item) => {
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
                        } ${isActive ? "pointer-events-none" : ""}`}
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

        {/* Profile */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileItems.map((item) => {
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
                        } ${isActive ? "pointer-events-none" : ""}`}
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
      </SidebarContent>
    </Sidebar>
  );
}

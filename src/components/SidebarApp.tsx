import {
  ArrowLeftIcon,
  Clock10Icon,
  Glasses,
  Home,
  PersonStandingIcon,
  PlusIcon,
  Sheet,
  Table2Icon,
  Trash2Icon,
} from "lucide-react"

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
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

import { Link, useRouterState } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react" 

const generalItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Trash", url: "/trash", icon: Trash2Icon },
]

const glassesItems = [
  { title: "Eyeglasses", url: "/eyeglasses", icon: Glasses },
  { title: "Brands", url: "/brands", icon: Sheet },
  { title: "Companies", url: "/companies", icon: Sheet },
]

const managementItems = [
  { title: "Drawers", url: "/drawers", icon: Sheet },
  { title: "Glasses Table", url: "/glasses-table", icon: Table2Icon },
  { title: "Add New Glasses", url: "/add-glasses", icon: PlusIcon },
  { title: "Glasses Status", url: "/glasses-status", icon: Clock10Icon },
]

const profileItems = [
  { title: "Profile", url: "/profile", icon: PersonStandingIcon },
  { title: "Logout", url: "/logout", icon: ArrowLeftIcon },
]

export function SidebarApp() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <Sidebar>
      <SidebarContent className="bg-[#0138C8] text-white">
        {/* General */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => {
                const isActive = currentPath.startsWith(item.url)
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
                )
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
                const isActive = currentPath.startsWith(item.url)
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
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Drawers Dropdown */}
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <Sheet size={18} />
                        <span>Drawers</span>
                      </div>
                      <ChevronRight size={16} className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub>
                      {["Laci A", "Laci B", "Laci C", "Laci D"].map((drawer) => (
                        <SidebarMenuSubItem key={drawer}>
                          <SidebarMenuButton asChild>
                            <Link
                              to={`/${drawer
                                .toLowerCase()
                                .replace(" ", "-")}` as any}
                              className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-[#B1F70B] hover:text-black"
                            >
                              <span>{drawer}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Other Management Items */}
              {managementItems
                .filter((item) => item.title !== "Drawers")
                .map((item) => {
                  const isActive = currentPath.startsWith(item.url)
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
                  )
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
                const isActive = currentPath.startsWith(item.url)
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
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

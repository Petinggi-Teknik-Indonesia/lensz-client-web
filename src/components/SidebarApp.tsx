import { ArrowLeftIcon, Clock10Icon, Glasses, Home, PersonStandingIcon, PlusIcon, Sheet, Table2Icon,  Trash2Icon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useRouterState } from "@tanstack/react-router"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Trash", url: "/trash", icon: Trash2Icon },
  { title: "Eyeglasses", url: "/eyeglasses", icon: Glasses },
  { title: "Brands", url: "/brands", icon: Sheet },
  { title: "Companies", url: "/companies", icon: Sheet },
  { title: "Drawers", url: "/drawers", icon: Sheet },
  { title: "Glasses Table", url: "/glasses-table", icon: Table2Icon },
  { title: "Add New Glasses", url: "/add-glasses", icon: PlusIcon },
  { title: "Glasses Status", url: "/glasses-status", icon: Clock10Icon },
  { title: "Profile", url: "/profile", icon: PersonStandingIcon },
  { title: "Logout", url: "/logout", icon: ArrowLeftIcon },
]

export function SidebarApp() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <Sidebar>
      <SidebarContent className="bg-[#0138C8] text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
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
                        } ${isActive ? "pointer-events-none" : ""}`} // disable hover when active
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

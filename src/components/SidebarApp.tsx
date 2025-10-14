import { Glasses, Home, Sheet } from "lucide-react"
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
  { title: "Eyeglasses", url: "/eyeglasses", icon: Glasses },
  { title: "Brands", url: "/brands", icon: Sheet },
  { title: "Companies", url: "/companies", icon: Sheet },
  { title: "Drawers", url: "/drawers", icon: Sheet },
  { title: "Test", url: "/test", icon: Sheet },
]

export function SidebarApp() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
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

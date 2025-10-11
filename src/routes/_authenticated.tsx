import { SidebarApp } from "@/components/SidebarApp";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {},
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SidebarProvider>
        <SidebarApp />
        <main>
          <SidebarTrigger />
          <div className="px-6">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

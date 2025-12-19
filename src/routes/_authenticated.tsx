import { SidebarApp } from "@/components/SidebarApp";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import GlassesStatusToast from "@/components/websockets/StatusNotification";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { WebSocketNotifier } from "@/components/WebSocketListener.tsx";
import { AddGlassesWebSocket } from "@/components/websockets/AddGlassesWebSocket.tsx";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {},
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <GlassesStatusToast />
      <SidebarProvider>
        <SidebarApp />
        <WebSocketNotifier />
        <AddGlassesWebSocket/>

        {/* Main area */}
        <main className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Header (fixed height) */}
          <div className="px-4 py-2 shadow-md bg-secondary flex items-center shrink-0 sticky top-0 z-10">
            <SidebarTrigger className="border-2" />
          </div>

          {/* Content area (strict remaining height) */}
          <div className="grow min-h-0 overflow-hidden">
            {/* Inner scrollable area */}
            <div className="h-full overflow-auto px-4 py-2">
              <Outlet />
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

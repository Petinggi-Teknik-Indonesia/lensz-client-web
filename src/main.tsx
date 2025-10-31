// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner"
import { WebSocketNotifier } from "@/components/WebSocketListener.tsx";
import { AddGlassesWebSocket } from "./components/websockets/AddGlassesWebSocket.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster closeButton richColors theme="light"/>
      <WebSocketNotifier />
      <AddGlassesWebSocket />
    </QueryClientProvider>
  // </StrictMode>
);

import { useWebSocket } from "@/hooks/useWebSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function GlassesStatusToast() {
  const queryClient = useQueryClient();
    useWebSocket((msg) => {
    console.log("📩 Received message:", msg);

    if (msg.type === "glasses_status_updated") {
      const { rfid, status } = msg.payload || {};
      toast.info("Glasses Status Updated", {
        description: `RFID ${rfid || "Unknown"} is now ${status || "updated"}.`,
        duration: 4000,
      });
      queryClient.invalidateQueries({queryKey:["glasses"]})
    }
  });

  return null; // no UI, just listens in the background
}

export default GlassesStatusToast;
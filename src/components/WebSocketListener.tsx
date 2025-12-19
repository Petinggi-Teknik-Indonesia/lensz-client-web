import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";

export function WebSocketNotifier() {
  useWebSocket((msg) => {
    console.log("📩 Received message:", msg);
    if (msg.type === "rfid_scanned") {
      const rfid = msg.payload?.rfid || "Unknown RFID";
      toast.success(`RFID Scanned: ${rfid}`, {
        description: "A new RFID scan was detected.",
        duration: 4000,
      });
    }
  });

  return null; // no UI, just listens in the background
}



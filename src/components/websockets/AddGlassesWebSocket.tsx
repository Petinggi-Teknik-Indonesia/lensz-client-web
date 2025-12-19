import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import AddGlassesForm from "../forms/AddGlassesForm";
import { useEffect, useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { webSocketCompleteRegistration } from "@/api/glassesEvents";
import notification from "@/assets/sounds/notification.mp3";

export function AddGlassesWebSocket() {
  const [open, setOpen] = useState(false);
  const [scannedRFID, setScannedRFID] = useState<string | null>(null);
  // const mutation = useMutation({ mutationFn: webSocketCompleteRegistration });

  const { send } = useWebSocket((msg) => {
    console.log("📩 Received message:", msg);

    if (
      msg.type === "registration_started" ||
      msg.type === "registration_waiting"
    ) {
      const rfid = msg.payload?.rfid || "Unknown RFID";

      const audio = new Audio(notification);
      audio.volume = 1;
      audio.play().catch(() => {});

      toast.success(`RFID Scanned: ${rfid}`, {
        description: "A new RFID scan was detected.",
        duration: 4000,
      });

      setScannedRFID(rfid);
      setOpen(true);
    }
  });


  useEffect(() => {
    if (!open) return; // 🔴 only when dialog is open

    console.log("💓 starting registration heartbeat");

    const interval = setInterval(() => {
      send({ type: "registration_heartbeat" });
      console.log("💓 heartbeat sent");
    }, 1000); // every 10 seconds

    return () => {
      console.log("🛑 stopping registration heartbeat");
      clearInterval(interval);
    };
  }, [open, send]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && open) {
          // dialog is being closed → cancel registration
          send({ type: "registration_cancel" });
        }
        setOpen(next);
      }}
    >
      {/* Trigger button */}
      {/* <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}></Button>
      </DialogTrigger> */}

      {/* Modal content */}
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add New Glasses</DialogTitle>
        </DialogHeader>

        <AddGlassesForm
          rfid={scannedRFID ?? ""}
          onSuccess={ () => {

            // 🔴 ACK BACKEND
            send({ type: "registration_confirm" });

            setOpen(false);
            setScannedRFID(null);
          }}
          onCancel={() => {
            // 🔴 TELL BACKEND WE CANCELLED
            send({ type: "registration_cancel" });

            setOpen(false);
            setScannedRFID(null);
          }}
        />

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

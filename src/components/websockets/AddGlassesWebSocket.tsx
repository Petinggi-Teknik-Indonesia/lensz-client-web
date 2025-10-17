import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import AddGlassesForm from "../forms/AddGlassesForm";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { webSocketCompleteRegistration } from "@/api/glassesEvents";

export function AddGlassesWebSocket() {
  const [open, setOpen] = useState(false);
  const [scannedRFID, setScannedRFID] = useState<string | null>(null);
  const mutation = useMutation({mutationFn: webSocketCompleteRegistration});

  useWebSocket((msg) => {
    console.log("📩 Received message:", msg);
    if (msg.type === "rfid_scanned") {
      const rfid = msg.payload?.rfid || "Unknown RFID";
      toast.success(`RFID Scanned: ${rfid}`, {
        description: "A new RFID scan was detected.",
        duration: 4000,
      });

      setScannedRFID(rfid);
      setOpen(true); // 👈 Open the dialog automatically
    }
  });

    const handleFormSubmit = async () => {
    console.log("✅ Parent detected form submission!");
    try {
      await mutation.mutateAsync();
      console.log("hIT");
    } catch (error) {
      toast.error("Failed to add glasses", {
        description: (error as Error).message,
      });
    }
    toast.success("Form submitted successfully!");
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}
      {/* <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}></Button>
      </DialogTrigger> */}

      {/* Modal content */}
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Add New Glasses</DialogTitle>
        </DialogHeader>

        <AddGlassesForm
          rfid={scannedRFID ?? ""} 
          onSuccess={() => {
            handleFormSubmit();
            setOpen(false);
            setScannedRFID(null);
          }}
          onCancel={() => {
            handleFormSubmit();
            setOpen(false);
            setScannedRFID(null);
          }}
        />

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

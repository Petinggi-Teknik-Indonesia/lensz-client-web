import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddGlassesForm from "../forms/AddGlassesForm";
import type { ReactNode } from "react";

export default function AddGlassesModal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>{children}</Button>
      </DialogTrigger>

      {/* Modal content */}
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add New Glasses</DialogTitle>
        </DialogHeader>

        <AddGlassesForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} rfid="xxx"/>

        <DialogFooter>
          {/* <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

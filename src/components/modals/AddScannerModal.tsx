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
import type { ReactNode } from "react";
import AddScannerForm from "../forms/AddScannerForm";

export default function AddScannerModal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>{children}</Button>
      </DialogTrigger>

      {/* Modal content */}
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Add New Scanner</DialogTitle>
        </DialogHeader>

        <AddScannerForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />

        <DialogFooter>
          {/* <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

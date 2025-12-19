import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditScannerForm from "../forms/EditScannerForm";
import type { Scanner } from "@/types/scanners";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Scanner;
};

export default function EditScannerModal({ open, onOpenChange, data }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Scanner</DialogTitle>
        </DialogHeader>

        <EditScannerForm
          data={data}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

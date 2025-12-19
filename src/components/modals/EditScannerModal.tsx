import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Brands } from "@/types/brands";
import EditScannerForm from "../forms/EditScannerForm";

interface EditScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Brands | null;
}

export default function EditScannerModal({
  open,
  onOpenChange,
  data,
}: EditScannerModalProps) {
  console.log(data?.id)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
        </DialogHeader>
        {data && (
          <EditScannerForm
            scannerID={data.id}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

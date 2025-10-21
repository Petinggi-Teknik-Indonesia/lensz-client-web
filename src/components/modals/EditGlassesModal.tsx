import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import EditGlassesForm from "../forms/EditGlassesForm";
import type { Glasses } from "@/types/glasses";

interface EditGlassesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Glasses | null;
}

export default function EditGlassesModal({
  open,
  onOpenChange,
  data,
}: EditGlassesModalProps) {
  console.log(data?.id)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Glasses</DialogTitle>
        </DialogHeader>
        {data && (
          <EditGlassesForm
            data={data.id}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Brands } from "@/types/brands";
import EditDrawerForm from "../forms/EditDrawerForm";

interface EditBrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Brands | null;
}

export default function EditBrandModal({
  open,
  onOpenChange,
  data,
}: EditBrandModalProps) {
  console.log(data?.id)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
        </DialogHeader>
        {data && (
          <EditDrawerForm
            drawerID={data.id}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

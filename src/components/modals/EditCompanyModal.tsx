import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Companies } from "@/types/companies";
import EditCompanyForm from "../forms/EditCompanyForm";

interface EditCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Companies | null;
}

export default function EditCompanyModal({
  open,
  onOpenChange,
  data,
}: EditCompanyModalProps) {
  console.log(data?.id)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>
        {data && (
          <EditCompanyForm
            companyID={data.id}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { Glasses } from "@/types/glasses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateGlasses } from "@/api/glasses";
import { toast } from "sonner";

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
  const [formData, setFormData] = useState<Partial<Glasses>>({});
//   const queryClient = useQueryClient();

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

//   const mutation = useMutation({
//     mutationFn: (payload: Partial<Glasses>) =>
//       updateGlasses(data!.id, payload),
//     onSuccess: () => {
//       toast.success("Glasses updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["glasses"] });
//       onOpenChange(false);
//     },
//     onError: () => toast.error("Failed to update glasses"),
//   });

//   const handleSubmit = () => {
//     mutation.mutate(formData);
//   };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Glasses</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <Input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
          />
          <Input
            value={formData.color || ""}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            placeholder="Color"
          />
          <Input
            value={formData.type || ""}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="Type"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {/* <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

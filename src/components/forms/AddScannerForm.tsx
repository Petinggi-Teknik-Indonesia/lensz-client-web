import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createScanner } from "@/api/scanners";

type AddScannerFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const formSchema = z.object({
  deviceName: z.string().min(1, "Device name is required"),
});

export default function AddScannerForm({ onSuccess, onCancel }: AddScannerFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createScanner,
    onSuccess: () => {
      toast.success("Scanner added successfully!");
      queryClient.invalidateQueries({ queryKey: ["scanners"] });
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to add scanner");
    },
  });

  const form = useForm({
    defaultValues: {
      deviceName: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <form
      id="add-scanner-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="deviceName"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Scanner Name</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter scanner name"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="add-scanner-form">
          Submit
        </Button>
      </div>
    </form>
  );
}

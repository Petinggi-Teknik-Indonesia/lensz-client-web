"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateScanner } from "@/api/scanners";
import type { Scanner } from "@/types/scanners";

type EditScannerFormProps = {
  data: Scanner;
  onSuccess: () => void;
  onCancel: () => void;
};

const formSchema = z.object({
  deviceName: z.string().min(1, "Device name is required"),
});

export default function EditScannerForm({ data, onSuccess, onCancel }: EditScannerFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: { deviceName: string }) => updateScanner(data.ID, payload),
    onSuccess: () => {
      toast.success("Scanner updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["scanners"] });
      onSuccess();
    },
    onError: (err) => {
      toast.error("Failed to update scanner", {
        description: (err as Error)?.message,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      deviceName: data.deviceName ?? "",
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
      id="edit-scanner-form"
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
                autoComplete="off"
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
        <Button type="submit" form="edit-scanner-form" disabled={mutation.isPending}>
          Save
        </Button>
      </div>
    </form>
  );
}

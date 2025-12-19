"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  getAllScanners,
  updateScanner,
} from "@/api/scanners";

type EditScannerFormProps = {
  scannerID: number;
  onSuccess: () => void;
  onCancel: () => void;
};

const formSchema = z.object({
  deviceName: z.string().min(1, "Device name is required"),
});

export default function EditScannerForm({
  scannerID,
  onSuccess,
  onCancel,
}: EditScannerFormProps) {
  const queryClient = useQueryClient();

  const { data: scanners } = useQuery({
    queryKey: ["scanners"],
    queryFn: getAllScanners,
  });

  const scanner = scanners?.find(
    (s: any) => s.id === scannerID
  );

  const mutation = useMutation({
    mutationFn: (payload: { deviceName: string }) =>
      updateScanner(scannerID, payload),
    onSuccess: () => {
      toast.success("Scanner updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["scanners"],
      });
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to update scanner");
    },
  });

  const form = useForm({
    defaultValues: {
      deviceName: scanner?.deviceName ?? "",
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
          const isInvalid =
            field.state.meta.isTouched &&
            !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                Scanner Name
              </FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value)
                }
              />
              {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </Field>
          );
        }}
      />

      {/* SAME button layout */}
      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" form="edit-scanner-form">
          Save
        </Button>
      </div>
    </form>
  );
}

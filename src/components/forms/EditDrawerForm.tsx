"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateDrawers, getAllDrawers } from "@/api/drawers";
import type { Drawers } from "@/types/drawers";

type EditDrawerFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
  drawerID: number;
};

const formSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
});

export default function EditDrawerForm(props: EditDrawerFormProps) {
  const { data: drawerData } = useQuery({
    queryKey: ["drawers"],
    queryFn: getAllDrawers,
  });

  const drawers: Drawers[] = drawerData ?? [];
  const selectedDrawer = drawers.find((d) => d.id === props.drawerID);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (v: any) => updateDrawers(props.drawerID, v),
  });

  const form = useForm({
    defaultValues: {
      name: selectedDrawer?.name || "",
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      console.log("onSubmit", value);
      try {
        await mutation.mutateAsync(value);
        toast.success("Drawer updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["drawers"] });
        props.onSuccess();
      } catch (error) {
        toast.error("Failed to update drawer", {
          description: (error as Error).message,
        });
      }
    },
  });

  return (
    <form
      id="edit-drawer-form"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Submitting form...");
        form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Drawer Name</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Enter drawer name"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <Field orientation="horizontal" className="mt-6 flex justify-end">
        <Button type="button" variant="outline" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="edit-drawer-form">
          Save
        </Button>
      </Field>
    </form>
  );
}

"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBrands } from "@/api/glassesDependencies";
import { updateBrand } from "@/api/brands";
import type { Brands } from "@/types/brands";

type EditBrandFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
  brandID: number;
};

const formSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
});

export default function EditBrandForm(props: EditBrandFormProps) {
  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });

  const brands: Brands[] = brandsData ?? [];
  const selectedBrand = brands.find((b) => b.id === props.brandID);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (v: any) => updateBrand(props.brandID, v),
  });

  const form = useForm({
    defaultValues: {
      name: selectedBrand?.name || "",
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      console.log("onSubmit", value);
      try {
        await mutation.mutateAsync(value);
        toast.success("Brand updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["brands"] });
        props.onSuccess();
      } catch (error) {
        toast.error("Failed to update brand", {
          description: (error as Error).message,
        });
      }
    },
  });

  return (
    <form
      id="edit-brand-form"
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
              <FieldLabel htmlFor={field.name}>Brand Name</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Enter brand name"
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
        <Button type="submit" form="edit-brand-form">
          Save
        </Button>
      </Field>
    </form>
  );
}

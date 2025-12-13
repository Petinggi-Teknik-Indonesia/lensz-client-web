"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCompanies } from "@/api/companies";
import { updateCompany } from "@/api/companies";
import type { Companies } from "@/types/companies";

type EditCompanyFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
  companyID: number;
};

const formSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
});

export default function EditCompanyForm(props: EditCompanyFormProps) {
  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });

  const companies: Companies[] = companiesData ?? [];
  const selectedCompany = companies.find((c) => c.id === props.companyID);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (v: any) => updateCompany(props.companyID, v),
  });

  const form = useForm({
    defaultValues: {
      name: selectedCompany?.name || "",
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      console.log("onSubmit", value);
      try {
        await mutation.mutateAsync(value);
        toast.success("Company updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        props.onSuccess();
      } catch (error) {
        toast.error("Failed to update company", {
          description: (error as Error).message,
        });
      }
    },
  });

  return (
    <form
      id="edit-company-form"
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
              <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Enter company name"
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
        <Button type="submit" form="edit-company-form">
          Save
        </Button>
      </Field>
    </form>
  );
}

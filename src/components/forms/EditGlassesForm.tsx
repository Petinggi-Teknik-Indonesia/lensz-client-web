"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGlasses, updateGlasses } from "@/api/glasses";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import {
  getAllBrands,
  getAllCompanies,
  getAllDrawers,
} from "@/api/glassesDependencies";
import type { Brands } from "@/types/brands";
import type { Companies } from "@/types/companies";
import type { Drawers } from "@/types/drawers";
import type { Glasses } from "@/types/glasses";

type EditGlassesFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
  data: number;
};

const formSchema = z.object({
  rfid: z.string().min(1, "RFID cannot be empty"),
  name: z.string().min(1, "Name cannot be empty"),
  type: z.string().min(1, "Type cannot be empty"),
  color: z.string().min(1, "Color cannot be empty"),
  status: z.string().min(1, "Status cannot be empty"),
  drawer: z.object({
    name: z.string(),
    id: z.number(),
  }),
  company: z.object({
    name: z.string(),
    id: z.number(),
  }),
  brand: z.object({
    name: z.string(),
    id: z.number(),
  }),
});

export default function EditGlassesForm(props: EditGlassesFormProps) {
  const glassesID = props.data;
  const { data: glassesData } = useQuery({
    queryKey: ["singleGlass"],
    queryFn: () => getGlasses(glassesID),
  });
  console.log(glassesData);
  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });
  const brands: Brands[] = brandsData ?? [];

  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });
  const companies: Companies[] = companiesData ?? [];

  const { data: drawersData } = useQuery({
    queryKey: ["drawers"],
    queryFn: getAllDrawers,
  });
  const drawers: Drawers[] = drawersData ?? [];

  const mutation = useMutation({
    mutationFn: (v: any) => updateGlasses(glassesID, v),
  });
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      rfid: glassesData?.rfid || "",
      name: glassesData?.name || "",
      type: glassesData?.type || "",
      color: glassesData?.color || "",
      status: glassesData?.status || "Tersedia",
      drawer: { name: glassesData?.drawer || "", id: glassesData?.drawerId },
      company: { name: glassesData?.company || "", id: glassesData?.companyId },
      brand: { name: glassesData?.brand || "", id: glassesData?.brandId },
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      console.log("onSubmit");
      console.log(value);
      try {
        await mutation.mutateAsync(value);

        toast.success("Glasses updated successfully!", {
          description: (
            <pre className="bg-code text-primary mt-2 w-[320px] overflow-x-auto rounded-md p-4">
              <code>{JSON.stringify(value, null, 2)}</code>
            </pre>
          ),
          position: "bottom-right",
        });

        queryClient.invalidateQueries({ queryKey: ["glasses"] });
        props.onSuccess();
      } catch (error) {
        toast.error("Failed to update glasses", {
          description: (error as Error).message,
        });
      }
    },
  });

  return (
    <form
      id="edit-glasses-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* Name */}
      <form.Field
        name="name"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Eyeglasses name"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      {/* Type, Color, Status */}
      <FieldGroup className="mt-4 border-t pt-4">
        <form.Field
          name="type"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Type</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Sunglasses"
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="color"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Color</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Frame color"
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name="status"
          children={(field) => {
            const statusOptions = [
              "Tersedia",
              "Terjual",
              "Rusak",
              "Terpinjam",
              "Lainnya",
            ];
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    {field.state.value || "Select status"}
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />
</div>
      </FieldGroup>

      {/* Drawer / Company / Brand */}
      <FieldGroup className="mt-4 border-t pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Drawer */}
          <form.Field
            name="drawer"
            children={(field) => (
              <Field>
                <FieldLabel>Drawer</FieldLabel>
                <Select
                  value={
                    field.state.value.id ? String(field.state.value.id) : ""
                  }
                  onValueChange={(value) => {
                    const selected = drawers.find(
                      (i) => String(i.id) === value
                    );
                    field.handleChange({
                      id: selected?.id ?? 0,
                      name: selected?.name ?? "",
                    });
                  }}
                >
                  <SelectTrigger>
                    {field.state.value.name || "Select drawer"}
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1">
                      <Input
                        placeholder="Or type a new drawer..."
                        value={
                          field.state.value.id
                            ? ""
                            : (field.state.value.name ?? "")
                        }
                        onChange={(e) =>
                          field.handleChange({
                            name: e.target.value,
                            id: 0,
                          })
                        }
                      />
                    </div>
                    <div className="border-t my-1" />
                    {drawers.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          {/* Company */}
          <form.Field
            name="company"
            children={(field) => (
              <Field>
                <FieldLabel>Company</FieldLabel>
                <Select
                  value={
                    field.state.value.id ? String(field.state.value.id) : ""
                  }
                  onValueChange={(value) => {
                    const selected = companies.find(
                      (i) => String(i.id) === value
                    );
                    field.handleChange({
                      id: selected?.id ?? 0,
                      name: selected?.name ?? "",
                    });
                  }}
                >
                  <SelectTrigger>
                    {field.state.value.name || "Select company"}
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1">
                      <Input
                        placeholder="Or type a new company..."
                        value={
                          field.state.value.id
                            ? ""
                            : (field.state.value.name ?? "")
                        }
                        onChange={(e) =>
                          field.handleChange({
                            name: e.target.value,
                            id: 0,
                          })
                        }
                      />
                    </div>
                    <div className="border-t my-1" />
                    {companies.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          {/* Brand */}
          <form.Field
            name="brand"
            children={(field) => (
              <Field>
                <FieldLabel>Brand</FieldLabel>
                <Select
                  value={
                    field.state.value.id ? String(field.state.value.id) : ""
                  }
                  onValueChange={(value) => {
                    const selected = brands.find((i) => String(i.id) === value);
                    field.handleChange({
                      id: selected?.id ?? 0,
                      name: selected?.name ?? "",
                    });
                  }}
                >
                  <SelectTrigger>
                    {field.state.value.name || "Select brand"}
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1">
                      <Input
                        placeholder="Or type a new brand..."
                        value={
                          field.state.value.id
                            ? ""
                            : (field.state.value.name ?? "")
                        }
                        onChange={(e) =>
                          field.handleChange({
                            name: e.target.value,
                            id: 0,
                          })
                        }
                      />
                    </div>
                    <div className="border-t my-1" />
                    {brands.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      {/* Buttons */}
      <Field orientation="horizontal" className="mt-6 flex justify-end">
        <Button type="button" variant="outline" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="edit-glasses-form">
          Save
        </Button>
      </Field>
    </form>
  );
}

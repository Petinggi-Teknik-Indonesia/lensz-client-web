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
import { addGlasses } from "@/api/glasses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { getAllCompanies } from "@/api/companies";
import { getAllBrands } from "@/api/brands";
import { getAllDrawers } from "@/api/drawers";
import type { Brands } from "@/types/brands";
import type { Companies } from "@/types/companies";
import type { Drawers } from "@/types/drawers";
import { Textarea } from "../ui/textarea";
import ColorPickerComponent from "@/components/ui/color-picker";

type AddGlassesFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
  rfid: string;
};

const formSchema = z.object({
  rfid: z.string().min(1, "RFID cannot be empty"),
  name: z.string().min(1, "Name cannot be empty"),
  type: z.string().min(1, "Type cannot be empty"),
  color: z.string().min(1, "Color cannot be empty"),
  status: z.string().min(1, "Status cannot be empty"),
  description: z.string(),
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

function AddGlassesForm(props: AddGlassesFormProps) {
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

  const mutation = useMutation({ mutationFn: addGlasses });
  const queryClient = useQueryClient();
  console.log(props.rfid);
  const glassesForm = useForm({
    defaultValues: {
      rfid: props.rfid,
      name: "",
      type: "",
      color: "",
      description: "",
      status: "Tersedia",
      drawer: { name: "", id: 0 },
      company: { name: "", id: 0 },
      brand: { name: "", id: 0 },
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutation.mutateAsync(value);

        toast.success("Glasses added successfully!", {
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
        toast.error("Failed to add glasses", {
          description: (error as Error).message,
        });
      }
    },
  });

  return (
    <form
      id="add-glasses-form"
      onSubmit={(e) => {
        e.preventDefault();
        glassesForm.handleSubmit();
      }}
      className=""
    >
      <div className="flex flex-col md:flex-row gap-4 h-[86%]">
        <div className="flex-1">
          <glassesForm.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Eyeglasses name"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/* HORIZONTAL FIELDSET */}
          <FieldGroup className="mt-4 border-t pt-4">
            {/* Make fields align in a row */}
            {/* Type */}
            <glassesForm.Field
              name="type"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. Sunglasses, Optical"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <div className="grid grid-cols-2 gap-4">
              {/* Color */}
              <glassesForm.Field
                name="color"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Color</FieldLabel>
                      <ColorPickerComponent
                        value={field.state.value}
                        defaultValue="#ffffff"
                        onChange={field.handleChange}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Status */}
              <glassesForm.Field
                name="status"
                children={(field) => {
                  const statusOptions = [
                    "Tersedia",
                    "Terjual",
                    "Rusak",
                    "Terpinjam",
                    "Lainnya",
                  ];
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger>
                          <span
                            className={
                              field.state.value ? "" : "text-muted-foreground"
                            }
                          >
                            {field.state.value || "Select status"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </FieldGroup>

          {/* HORIZONTAL FIELDSET */}
          <FieldGroup className="mt-4 border-t pt-4">
            {/* Make fields align in a row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Drawer */}
              <glassesForm.Field
                name="drawer"
                children={(field) => {
                  const selectedValue = field.state.value?.id
                    ? String(field.state.value.id)
                    : "";
                  const displayName =
                    field.state.value?.name || "Select drawer";

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Drawer</FieldLabel>

                      <Select
                        value={selectedValue}
                        onValueChange={(value) => {
                          const selectedDrawer = drawers.find(
                            (drawer) => String(drawer.id) === value
                          );
                          field.handleChange({
                            id: selectedDrawer?.id ?? 0,
                            name: selectedDrawer?.name ?? "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <span
                            className={
                              displayName === "Select drawer"
                                ? "text-muted-foreground"
                                : ""
                            }
                          >
                            {displayName}
                          </span>
                        </SelectTrigger>

                        <SelectContent>
                          <div className="px-2 py-1">
                            <Input
                              placeholder="Or type a new drawer..."
                              value={
                                field.state.value?.id
                                  ? ""
                                  : (field.state.value?.name ?? "")
                              }
                              onChange={(e) => {
                                const newDrawerName = e.target.value;
                                field.handleChange({
                                  name: newDrawerName,
                                  id: 0,
                                });
                              }}
                              autoComplete="off"
                            />
                          </div>

                          <div className="border-t my-1" />

                          {drawers.map((drawer) => (
                            <SelectItem
                              key={drawer.id}
                              value={String(drawer.id)}
                            >
                              {drawer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  );
                }}
              />

              {/* Company */}
              <glassesForm.Field
                name="company"
                children={(field) => {
                  const selectedValue = field.state.value?.id
                    ? String(field.state.value.id)
                    : "";
                  const displayName =
                    field.state.value?.name || "Select company";

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Company</FieldLabel>

                      <Select
                        value={selectedValue}
                        onValueChange={(value) => {
                          const selectedCompany = companies.find(
                            (company) => String(company.id) === value
                          );
                          field.handleChange({
                            id: selectedCompany?.id ?? 0,
                            name: selectedCompany?.name ?? "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <span
                            className={
                              displayName === "Select company"
                                ? "text-muted-foreground"
                                : ""
                            }
                          >
                            {displayName}
                          </span>
                        </SelectTrigger>

                        <SelectContent>
                          <div className="px-2 py-1">
                            <Input
                              placeholder="Or type a new company..."
                              value={
                                field.state.value?.id
                                  ? ""
                                  : (field.state.value?.name ?? "")
                              }
                              onChange={(e) => {
                                const newCompanyName = e.target.value;
                                field.handleChange({
                                  name: newCompanyName,
                                  id: 0,
                                });
                              }}
                              autoComplete="off"
                            />
                          </div>

                          <div className="border-t my-1" />

                          {companies.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={String(company.id)}
                            >
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  );
                }}
              />

              {/* Brand */}
              <glassesForm.Field
                name="brand"
                children={(field) => {
                  const selectedValue = field.state.value?.id
                    ? String(field.state.value.id)
                    : "";
                  const displayName = field.state.value?.name || "Select brand";

                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Brand</FieldLabel>

                      <Select
                        value={selectedValue}
                        onValueChange={(value) => {
                          const selectedBrand = brands.find(
                            (brand) => String(brand.id) === value
                          );
                          field.handleChange({
                            id: selectedBrand?.id ?? 0,
                            name: selectedBrand?.name ?? "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <span
                            className={
                              displayName === "Select brand"
                                ? "text-muted-foreground"
                                : ""
                            }
                          >
                            {displayName}
                          </span>
                        </SelectTrigger>

                        <SelectContent>
                          <div className="px-2 py-1">
                            <Input
                              placeholder="Or type a new brand..."
                              value={
                                field.state.value?.id
                                  ? ""
                                  : (field.state.value?.name ?? "")
                              }
                              onChange={(e) => {
                                const newBrandName = e.target.value;
                                field.handleChange({
                                  name: newBrandName,
                                  id: 0,
                                });
                              }}
                              autoComplete="off"
                            />
                          </div>

                          <div className="border-t my-1" />

                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={String(brand.id)}>
                              {brand.name}
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
        </div>
        <glassesForm.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field
                data-invalid={isInvalid}
                className="w-full md:w-[40%] h-full"
              >
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Description over here..."
                  autoComplete="off"
                  className="resize-none h-[100%]"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </div>

      <Field
        orientation="horizontal"
        className="mt-6 flex flex-row justify-end"
      >
        <Button type="button" variant="outline" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="add-glasses-form">
          Submit
        </Button>
      </Field>
    </form>
  );
}

export default AddGlassesForm;

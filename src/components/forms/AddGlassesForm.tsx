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
  SelectValue,
} from "../ui/select";
import { getAllBrands } from "@/api/glassesDependencies";
import type { Brands } from "@/types/glassesDependencies";

type AddGlassesFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const formSchema = z.object({
  rfid: z.string().min(1, "RFID cannot be empty"),
  name: z.string().min(1, "Name cannot be empty"),
  type: z.string().min(1, "Type cannot be empty"),
  color: z.string().min(1, "Color cannot be empty"),
  status: z.number(),
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
  const { data } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });
  const brands: Brands[] = data ?? [];

  const mutation = useMutation({ mutationFn: addGlasses });
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      rfid: "xxxxxxxxx",
      name: "",
      type: "",
      color: "",
      status: 0,
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

        queryClient.invalidateQueries({queryKey: ["glasses"]});
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
        form.handleSubmit();
      }}
    >
      {/* RFID */}
      {/* <form.Field
          name="rfid"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>RFID</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter RFID tag"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        /> */}

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
        <form.Field
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Color */}
          <form.Field
            name="color"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Color</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Frame color"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/* Status */}
          {/* <form.Field
            name="status"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    placeholder="Available / Sold / Reserved"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          /> */}
        </div>
      </FieldGroup>

      {/* HORIZONTAL FIELDSET */}
      <FieldGroup className="mt-4 border-t pt-4">
        {/* Make fields align in a row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Drawer */}
          <form.Field
            name="drawer.name"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Drawer</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Drawer name"
                  autoComplete="off"
                />
              </Field>
            )}
          />

          {/* Company */}
          <form.Field
            name="company.name"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Company name"
                  autoComplete="off"
                />
              </Field>
            )}
          />

          {/* Brand */}
          <form.Field
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
                      {/* 👇 Custom text instead of <SelectValue /> */}
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
                      {/* Inline input for new brand */}
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
                            field.handleChange({ name: newBrandName, id: 0 });
                          }}
                          autoComplete="off"
                        />
                      </div>

                      <div className="border-t my-1" />

                      {/* Existing brands */}
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

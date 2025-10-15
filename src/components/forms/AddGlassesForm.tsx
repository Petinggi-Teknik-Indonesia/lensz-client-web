import * as React from "react";
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

type AddGlassesFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const formSchema = z.object({
  rfid: z.string().min(1, "RFID cannot be empty"),
  name: z.string().min(1, "Name cannot be empty"),
  type: z.string().min(1, "Type cannot be empty"),
  color: z.string().min(1, "Color cannot be empty"),
  status: z.string().min(1, "Status cannot be empty"),
  drawer: z.object({
    name: z.string().optional(),
    id: z.number().optional(),
  }),
  company: z.object({
    name: z.string().optional(),
    id: z.number().optional(),
  }),
  brand: z.object({
    name: z.string().optional(),
    id: z.number().optional(),
  }),
});

function AddGlassesForm(props: AddGlassesFormProps) {
  const form = useForm({
    defaultValues: {
      rfid: "xxxxxxxxx",
      name: "",
      type: "",
      color: "",
      status: "",
      drawer: {},
      company: {},
      brand: {},
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast("Glasses added successfully!", {
        description: (
          <pre className="bg-code text-primary mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties,
      });

      props.onSuccess();
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
      <FieldGroup>
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
        <form.Field
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Available / Sold / Reserved"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
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
            name="brand.name"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Brand</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Brand name"
                  autoComplete="off"
                />
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <Field orientation="horizontal" className="mt-6">
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

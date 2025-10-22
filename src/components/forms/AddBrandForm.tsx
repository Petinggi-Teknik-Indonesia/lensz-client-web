import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addBrand } from "@/api/glassesDependencies";

type AddBrandFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

// ✅ Validate only "name"
const formSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
});

function AddBrandForm({ onSuccess, onCancel }: AddBrandFormProps) {
  const mutation = useMutation({ mutationFn: addBrand });

  const form = useForm({
    defaultValues: { name: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      try {
        await mutation.mutateAsync(value);

        toast.success("Brand added successfully!", {
          description: (
            <pre className="bg-code text-primary mt-2 w-[320px] overflow-x-auto rounded-md p-4">
              <code>{JSON.stringify(value, null, 2)}</code>
            </pre>
          ),
          position: "bottom-right",
        });

        onSuccess();
      } catch (error) {
        toast.error("Failed to add brand", {
          description: (error as Error).message,
        });
      }
    },
  });

  return (
    <form
      id="add-brand-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* 🏷️ Brand Name Field */}
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
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Enter brand name"
                autoComplete="off"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />

      {/* 🧭 Buttons */}
      <div className="mt-6 flex flex-row justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="add-brand-form">
          Submit
        </Button>
      </div>
    </form>
  );
}

export default AddBrandForm;

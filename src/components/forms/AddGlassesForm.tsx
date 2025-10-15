import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

type NewGlasses = {
  name: string;
  model?: string;
  rfid?: string;
};

async function createGlassesApi(data: NewGlasses) {
  const res = await fetch("/api/glasses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create glasses");
  return res.json();
}

export default function AddGlassesForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [rfid, setRfid] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createGlassesApi,
    onSuccess: () => {
      toast.success("Glasses added successfully");
      queryClient.invalidateQueries(["glasses"]);
      onSuccess?.();
    },
    onError: () => toast.error("Failed to add glasses"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, model, rfid });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label>Model</Label>
        <Input value={model} onChange={(e) => setModel(e.target.value)} />
      </div>
      <div>
        <Label>RFID</Label>
        <Input value={rfid} onChange={(e) => setRfid(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

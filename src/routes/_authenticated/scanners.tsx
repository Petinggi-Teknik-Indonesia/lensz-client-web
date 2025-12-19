import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "@/lib/cookie";
import instance from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

/* =========================
   ROLE CHECK (JWT)
   ========================= */
const getRoleFromToken = (): number | null => {
  const token = getCookie("access_token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1])).role ?? null;
  } catch {
    return null;
  }
};

export const Route = createFileRoute("/_authenticated/scanners")({
  component: ScannerPage,
});

function ScannerPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const role = getRoleFromToken();
  const isAllowed = role === 1 || role === 2;

  /* 🚫 Redirect if not admin/superadmin */
  if (!isAllowed) {
    navigate({ to: "/dashboard" });
    return null;
  }

  /* =========================
     FETCH SCANNERS
     ========================= */
  const { data: scanners, isLoading } = useQuery({
    queryKey: ["scanners"],
    queryFn: async () => {
      const res = await instance.get("/api/scanners");
      return res.data;
    },
  });

  /* =========================
     CREATE SCANNER
     ========================= */
  const [deviceName, setDeviceName] = useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      return instance.post("/api/scanners", { deviceName });
    },
    onSuccess: () => {
      toast.success("Scanner created");
      setDeviceName("");
      queryClient.invalidateQueries({ queryKey: ["scanners"] });
    },
    onError: () => toast.error("Failed to create scanner"),
  });

  /* =========================
     DELETE SCANNER
     ========================= */
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      instance.delete(`/api/scanners/${id}`),
    onSuccess: () => {
      toast.success("Scanner deleted");
      queryClient.invalidateQueries({ queryKey: ["scanners"] });
    },
    onError: () => toast.error("Delete not allowed"),
  });

  /* =========================
     RENDER
     ========================= */
  if (isLoading) return <p>Loading scanners...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Scanners</h1>

      {/* CREATE */}
      <div className="flex gap-2">
        <Input
          placeholder="Device name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />
        <Button onClick={() => createMutation.mutate()}>
          Add Scanner
        </Button>
      </div>

      {/* LIST */}
      <ul className="space-y-2">
        {scanners?.map((scanner: any) => (
          <li
            key={scanner.id}
            className="flex justify-between items-center border rounded px-3 py-2"
          >
            <span>{scanner.deviceName}</span>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteMutation.mutate(scanner.id)}
            >
              <Trash2 size={16} />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

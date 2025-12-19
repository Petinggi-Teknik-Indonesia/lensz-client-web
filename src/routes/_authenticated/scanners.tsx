import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getMe } from "@/api/auth";

export const Route = createFileRoute("/_authenticated/scanners")({
  component: ScannerPage,
});

function ScannerPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* =========================
     FETCH LOGGED-IN USER
     ========================= */
  const {
    data: me,
    isLoading: isMeLoading,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  /* =========================
     ROLE CHECK
     ========================= */
  const roleId = me?.role?.ID;
  const isAllowed = roleId === 1 || roleId === 2;

  /* 🚫 Redirect role 3 AFTER data loads */
  useEffect(() => {
    if (!isMeLoading && !isAllowed) {
      navigate({ to: "/dashboard" });
    }
  }, [isMeLoading, isAllowed, navigate]);

  /* =========================
     FETCH SCANNERS
     ========================= */
  const { data: scanners, isLoading } = useQuery({
    queryKey: ["scanners"],
    queryFn: async () => {
      const res = await instance.get("/api/scanners");
      return res.data;
    },
    enabled: isAllowed, // ⬅️ do NOT fetch if not allowed
  });

  /* =========================
     CREATE SCANNER
     ========================= */
  const [deviceName, setDeviceName] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      instance.post("/api/scanners", { deviceName }),
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
     LOADING STATES
     ========================= */
  if (isMeLoading || isLoading) {
    return <p>Loading...</p>;
  }

  /* =========================
     RENDER
     ========================= */
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
        <Button
          onClick={() => createMutation.mutate()}
          disabled={!deviceName}
        >
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

import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

import {
  getUnverifiedUsers,
  verifyUser,
  rejectUser,
} from "@/api/admin";
import { getMe } from "@/api/auth";
import type { User } from "@/types/users";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";

/* =========================
   ROUTE
   ========================= */
export const Route = createFileRoute(
  "/_authenticated/adminUser"
)({
  component: AdminVerifyUsersPage,
});

/* =========================
   PAGE
   ========================= */
function AdminVerifyUsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ===== AUTH ===== */
  const { data: me, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const isAdmin = me?.role?.ID === 1 || me?.role?.ID === 2;

  if (!meLoading && !isAdmin) {
    navigate({ to: "/dashboard" });
  }

  /* ===== DATA ===== */
  const { data: users, isLoading } = useQuery({
    queryKey: ["unverified-users"],
    queryFn: getUnverifiedUsers,
    enabled: isAdmin,
  });

  /* ===== MUTATIONS ===== */
  const verifyMutation = useMutation({
    mutationFn: verifyUser,
    onSuccess: () => {
      toast.success("User verified");
      queryClient.invalidateQueries({ queryKey: ["unverified-users"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectUser,
    onSuccess: () => {
      toast.success("User rejected");
      queryClient.invalidateQueries({ queryKey: ["unverified-users"] });
    },
  });

  /* ===== TABLE ===== */
  const columnHelper = createColumnHelper<User>();

  const columns: ColumnDef<User, unknown>[] = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
      }),
      columnHelper.accessor("email", {
        header: "Email",
      }),
      columnHelper.accessor("organization.name", {
        header: "Organization",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-green-600"
                onClick={() => verifyMutation.mutate(user.email)}
              >
                <Check />
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => rejectMutation.mutate(user.email)}
              >
                <X />
              </Button>
            </div>
          );
        },
      }),
    ],
    []
  );

  if (meLoading || isLoading) return <p>Loading...</p>;

  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      <h1 className="text-xl font-semibold">
        Verify Users
      </h1>

      <DataTable columns={columns} data={users ?? []} />
    </div>
  );
}

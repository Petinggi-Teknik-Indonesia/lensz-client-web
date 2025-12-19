import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, SearchIcon } from "lucide-react";
import { toast } from "sonner";

import { getAllScanners, deleteScanner } from "@/api/scanners";
import { getMe } from "@/api/auth";
import type { Scanner } from "@/types/scanners";
import { formatDate } from "@/lib/helpers";

import { DataTable } from "@/components/DataTable";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import AddScannerModal from "@/components/modals/AddScannerModal";
import EditScannerModal from "@/components/modals/EditScannerModal";

/* =========================
   ROUTE
   ========================= */
export const Route = createFileRoute("/_authenticated/scanners")({
  component: ScannerPage,
});

/* =========================
   PAGE
   ========================= */
function ScannerPage() {
  const queryClient = useQueryClient();

  /* =========================
     AUTH
     ========================= */
  const { data: me, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const canManage =
    me !== undefined && (me?.role?.ID === 1 || me?.role?.ID === 2);

  /* =========================
     DATA
     ========================= */
  const { data: scanners, isLoading } = useQuery({
    queryKey: ["scanners"],
    queryFn: getAllScanners,
  });

  /* =========================
     STATE
     ========================= */
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedScanner, setSelectedScanner] = useState<Scanner | null>(null);

  /* =========================
     DELETE
     ========================= */
  const deleteMutation = useMutation({
    mutationFn: deleteScanner,
    onSuccess: () => {
      toast.success("Scanner deleted");
      queryClient.invalidateQueries({ queryKey: ["scanners"] });
    },
    onError: (err: any) => {
      if (err?.response?.status === 403) {
        toast.error("You are not allowed to delete this scanner");
      } else {
        toast.error("Failed to delete scanner");
      }
    },
  });

  /* =========================
     TABLE COLUMNS
     ========================= */
  const columnHelper = createColumnHelper<Scanner>();

  const baseColumns: ColumnDef<Scanner, unknown>[] = [
    columnHelper.accessor("ID", {
      header: "ID",
    }),

    columnHelper.accessor("deviceName", {
      header: "Device Name",
    }),

    columnHelper.accessor((row) => row.createdAt ?? null, {
      id: "createdAt",
      header: "Created At",
      cell: (info) => {
        const value = info.getValue();
        return value ? formatDate(value) : "-";
      },
    }),

    columnHelper.accessor((row) => row.updatedAt ?? null, {
      id: "updatedAt",
      header: "Updated At",
      cell: (info) => {
        const value = info.getValue();
        return value ? formatDate(value) : "-";
      },
    }),
  ];
  const actionColumn: ColumnDef<Scanner, unknown> = columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const scanner = row.original;

      return (
        <ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {/* EDIT */}
              <DropdownMenuItem
                className="text-orange-500"
                onClick={() => {
                  setSelectedScanner(scanner);
                  setEditOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              {/* DELETE */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Scanner</AlertDialogTitle>
                    <AlertDialogDescription>
                      Delete <b>{scanner.deviceName}</b>?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600"
                      onClick={() => deleteMutation.mutate(scanner.ID)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      );
    },
  });

  const columns = useMemo<ColumnDef<Scanner, unknown>[]>(() => {
    return canManage ? [...baseColumns, actionColumn] : baseColumns;
  }, [canManage]);

  /* =========================
     FILTER
     ========================= */
  const filteredData = useMemo(() => {
    if (!scanners) return [];
    const q = search.toLowerCase();
    return scanners.filter((s) => s.deviceName.toLowerCase().includes(q));
  }, [scanners, search]);

  /* =========================
     LOADING
     ========================= */
  if (meLoading || isLoading) return <p>Loading...</p>;

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      {/* SEARCH + ADD */}
      <div className="flex justify-end gap-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={() => setSearch("")}>
              Clear
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {/* ADMIN ONLY */}
        {canManage && <AddScannerModal>+ Add Scanner</AddScannerModal>}
      </div>

      {/* TABLE */}
      <DataTable columns={columns} data={filteredData} />

      {/* EDIT MODAL — ADMIN ONLY */}
      {canManage && selectedScanner && (
        <EditScannerModal
          open={editOpen}
          onOpenChange={setEditOpen}
          data={selectedScanner}
        />
      )}
    </div>
  );
}

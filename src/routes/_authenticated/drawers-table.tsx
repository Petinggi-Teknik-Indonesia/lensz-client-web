import { useState, useMemo } from "react";
import AddDrawerModal from "@/components/modals/AddDrawerModal";
import EditDrawerModal from "@/components/modals/EditDrawerModal"; // ✅ Make sure this exists
import { getAllDrawers, formatDate } from "@/api/glassesDependencies";
import { deleteDrawer } from "@/api/drawers";
import { DataTable } from "@/components/DataTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { SearchIcon, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Drawers } from "@/types/drawers";
import { getMe } from "@/api/auth";
export const Route = createFileRoute("/_authenticated/drawers-table")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["drawers"],
    queryFn: getAllDrawers,
  });
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  /* =========================
     ROLE-BASED PERMISSION
     ========================= */
  const canShowDelete =
    me !== undefined && (me?.role?.ID === 1 || me?.role?.ID === 2);

  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDrawer, setSelectedDrawer] = useState<Drawers | null>(null);

  // ✅ Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDrawer(id),
    onSuccess: () => {
      toast.success("Drawer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["drawers"] });
    },
    onError: () => toast.error("Failed to delete drawer"),
  });

  const columnHelper = createColumnHelper<Drawers>();
  const columns = [
    columnHelper.accessor("id", { header: () => "ID" }),
    columnHelper.accessor("name", { header: () => "Name" }),
    columnHelper.accessor("createdAt", {
      header: () => "Created At",
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue() as Date) : "",
    }),
    columnHelper.accessor("updatedAt", {
      header: () => "Updated At",
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue() as Date) : "",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const drawer = row.original;
        return (
          <ButtonGroup>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {/* ✏️ Edit */}
                <DropdownMenuItem
                  className="text-orange-400"
                  onClick={() => {
                    setSelectedDrawer(drawer);
                    setEditOpen(true);
                  }}
                >
                  <Edit className="text-orange-400" />
                  Edit
                </DropdownMenuItem>

                {/* 🗑️ Delete */}
                {canShowDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash2 className="text-red-600" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Drawer</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <b>{drawer.name}</b>?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(drawer.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        );
      },
    }),
  ];

  // ✅ Filter by search
  const filteredData = useMemo(() => {
    if (!data) return [];
    const lower = search.toLowerCase();

    return data.filter((item: Drawers) =>
      [item.id, item.name, item.createdAt, item.updatedAt]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(lower))
    );
  }, [data, search]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      {/* 🔍 Search Bar + Add Button */}
      <div className="flex flex-row gap-2 justify-end">
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

        <AddDrawerModal>+ Add Drawer</AddDrawerModal>
      </div>

      {/* 📋 Data Table */}
      <DataTable<Drawers, any> columns={columns} data={filteredData} />

      {/* ✏️ Edit Drawer Modal */}
      {selectedDrawer && (
        <EditDrawerModal
          open={editOpen}
          onOpenChange={setEditOpen}
          data={{
            ...selectedDrawer,
            createdAt: selectedDrawer.createdAt
              ? new Date(selectedDrawer.createdAt)
              : new Date(),
            updatedAt: selectedDrawer.updatedAt
              ? new Date(selectedDrawer.updatedAt)
              : new Date(),
          }}
        />
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, SearchIcon, Trash2 } from "lucide-react";
import { deleteGlasses, getGlassesByDrawer } from "@/api/glasses";
import { DataTable } from "@/components/DataTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import type { Glasses } from "@/types/glasses";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import EditGlassesModal from "@/components/modals/EditGlassesModal";

export const Route = createFileRoute("/_authenticated/drawers/$drawerName")({
  component: DrawerPage,
});

function DrawerPage() {
  const { drawerName } = useParams({
    from: "/_authenticated/drawers/$drawerName",
  });

  // 🧠 Fetch glasses inside this drawer
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["glasses", drawerName],
    queryFn: () => getGlassesByDrawer(drawerName),
  });

  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Glasses | null>(null);
  const [search, setSearch] = useState("");
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteGlasses(id),
    onSuccess: () => {
      toast.success("Glasses deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["glasses"] });
    },
    onError: () => toast.error("Failed to delete glasses"),
  });

  const columnHelper = createColumnHelper<Glasses>();
  const columns = [
    columnHelper.accessor("id", { header: () => "ID" }),
    columnHelper.accessor("color", {
      header: () => "Color",
      cell: ({ getValue }) => {
        const color = getValue<string>();
        return (
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
        );
      },
    }),
    columnHelper.accessor("name", { header: () => "Name" }),
    columnHelper.accessor("drawer", { header: () => "Drawer" }),
    columnHelper.accessor("status", { header: () => "Status" }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <ButtonGroup>
            <Button
              variant="ghost"
              className="text-primary bg-secondary border-1"
              size="sm"
            >
              <Link
                to="/eyeglasses/$glassesId"
                params={{ glassesId: String(item.id) }}
                className="flex flex-row items-center justify-center gap-2"
              >
                <Eye />
                View
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="bg-secondary border-1"
                  size="icon-sm"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {/* EDIT */}
                <DropdownMenuItem
                  className="text-orange-400"
                  onClick={() => {
                    setSelectedItem(item);
                    setEditOpen(true);
                  }}
                >
                  <Edit className="text-orange-400" />
                  Edit
                </DropdownMenuItem>

                {/* DELETE */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600"
                      onSelect={(e) => e.preventDefault()} // 🧠 prevent dropdown auto-close
                    >
                      <Trash2 className="text-red-600" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Glasses</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <b>{item.name}</b>? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteMutation.mutate(item.id);
                          queryClient.invalidateQueries({
                            queryKey: ["glasses"],
                          });
                        }}
                        className="bg-red-600 hover:bg-red-700"
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
    }),
  ];

  // 🔍 Filter data by search input
  const filteredData = useMemo(() => {
    if (!data) return [];
    const lower = search.toLowerCase();

    return data.filter((item: Glasses) => {
      return [item.id, item.name, item.drawer, item.status, item.color]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(lower));
    });
  }, [data, search]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;
  if (!data || data.length === 0)
    return (
      <div className="h-full flex flex-col gap-2 mt-2">
        <h1 className="text-2xl font-semibold mb-2">{drawerName}</h1>
        <p>No glasses found in this drawer.</p>
      </div>
    );

  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      {/* 🏷️ Drawer Title */}
      <h1 className="text-2xl font-semibold mb-2">{drawerName}</h1>

      {/* 🔍 Search Bar */}
      <div className="flex flex-row gap-2 justify-end">
        <InputGroup>
          <InputGroupInput
            placeholder="Search glasses..."
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
      </div>

      {/* 📋 Glasses Table */}
      <DataTable<Glasses, any> columns={columns} data={filteredData} />
      {selectedItem && (
        <EditGlassesModal
          open={editOpen}
          onOpenChange={setEditOpen}
          data={selectedItem}
        />
      )}
    </div>
  );
}

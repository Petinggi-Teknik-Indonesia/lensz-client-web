import { useState, useMemo } from "react";
import { deleteGlasses, getAllGlasses } from "@/api/glasses";
import { DataTable } from "@/components/DataTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { Glasses } from "@/types/glasses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, SearchIcon, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddGlassesModal from "@/components/modals/AddGlassesModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { toast } from "sonner";
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
import EditGlassesModal from "@/components/modals/EditGlassesModal";
import { getMe } from "@/api/auth";

export const Route = createFileRoute("/_authenticated/eyeglasses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["glasses"],
    queryFn: getAllGlasses,
  });

  const {
    data: me,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  /* =========================
     ROLE-BASED PERMISSION
     ========================= */
  const canShowDelete =
    me !== undefined && (me?.role?.ID === 1 || me?.role?.ID === 2);

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
  // use a non-empty sentinel value for "All"
  const [statusFilter, setStatusFilter] = useState<string>("all");


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
    columnHelper.accessor("drawer", { header: () => "Drawers" }),
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
                {canShowDelete && (
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
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        );
      },
    }),
  ];

  // Collect unique statuses for dropdown
  const statusOptions = useMemo(() => {
    if (!data) return [];
    const unique = new Set(data.map((item) => item.status).filter(Boolean));
    return Array.from(unique);
  }, [data]);

  // Filter data by search and status
  const filteredData = useMemo(() => {
    if (!data) return [];
    const lower = search.toLowerCase();

    return data.filter((item) => {
      const matchesSearch = [
        item.id,
        item.name,
        item.drawer,
        item.status,
        item.color,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(lower));

      const matchesStatus =
        statusFilter === "all" ||
        item.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      {/* 🔍 Search Bar + Filter + Add Button */}
      <div className="flex flex-row gap-2 justify-end">
        {/* Search */}
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

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            {/* use non-empty value */}
            <SelectItem value="all">Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Add Button */}
        <AddGlassesModal>+ Add Glasses</AddGlassesModal>
      </div>

      {/* 📋 Data Table */}
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

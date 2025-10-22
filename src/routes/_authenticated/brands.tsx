import { useState, useMemo } from "react";
import { deleteBrand, getAllBrands } from "@/api/brands";
import { DataTable } from "@/components/DataTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, MoreHorizontal, SearchIcon, Trash2 } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
import AddBrandModal from "@/components/modals/AddBrandModal";
import EditBrandModal from "@/components/modals/EditBrandModal";
import { formatDate } from "@/api/glassesDependencies";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/brands")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });

  const [editOpen, setEditOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<{ id: number; name: string; createdAt?:string; updatedAt?: string; } | null>(null);
  const [search, setSearch] = useState("");

    const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    onSuccess: () => {
      toast.success("Brand deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: () => toast.error("Failed to delete brand"),
  });

  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor("id", { header: () => "ID" }),
    columnHelper.accessor("name", { header: () => "Name" }),
    columnHelper.accessor("createdAt", {
      header: () => "Created At",
      cell: (info) => (info.getValue() ? formatDate(info.getValue()) : ""),
    }),
    columnHelper.accessor("updatedAt", {
      header: () => "Updated At",
      cell: (info) => (info.getValue() ? formatDate(info.getValue()) : ""),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const brand = row.original;
        return (
          <ButtonGroup>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Edit */}
                <DropdownMenuItem
                  className="text-orange-400"
                  onClick={() => {
                    setSelectedBrand(brand);
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
                      <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <b>{brand.name}</b>? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteMutation.mutate(brand.id);
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

  const filteredData = useMemo(() => {
    if (!data) return [];
    const lower = search.toLowerCase();
    return data.filter((item) =>
      [item.id, item.name, item.createdAt, item.updatedAt]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(lower))
    );
  }, [data, search]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      {/* Search + Add */}
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
            <InputGroupButton onClick={() => setSearch("")}>Clear</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <AddBrandModal>+ Add Brand</AddBrandModal>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredData} />

      {/* Edit Brand Modal */}
{selectedBrand && (
<EditBrandModal
  open={editOpen}
  onOpenChange={setEditOpen}
  data={{
    ...selectedBrand,
    createdAt: selectedBrand.createdAt ? new Date(selectedBrand.createdAt) : new Date(),
    updatedAt: selectedBrand.updatedAt ? new Date(selectedBrand.updatedAt) : new Date(),
  }}
/>
)}
    </div>
  );
}

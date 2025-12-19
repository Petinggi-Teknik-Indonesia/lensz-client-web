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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { getCookie } from "@/lib/cookie";

export const Route = createFileRoute("/_authenticated/brands")({
  component: RouteComponent,
});

/* =========================
   SIMPLE ROLE EXTRACTION
   ========================= */
const getRoleFromToken = (): number | null => {
  const token = getCookie("access_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
};

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });

  const role = getRoleFromToken();
  const canShowDelete = role === 1 || role === 2;

  const [editOpen, setEditOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [search, setSearch] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    onSuccess: () => {
      toast.success("Brand deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (err: any) => {
      if (err?.response?.status === 403) {
        toast.error("You are not allowed to delete this brand");
      } else {
        toast.error("Failed to delete brand");
      }
    },
  });

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated At",
      cell: (info) => formatDate(info.getValue()),
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
                {/* EDIT */}
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

                {/* DELETE (ROLE 1 & 2 ONLY) */}
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
                        <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <b>{brand.name}</b>? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => deleteMutation.mutate(brand.id)}
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

  const filteredData = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.filter((item) =>
      Object.values(item)
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, search]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      {/* SEARCH + ADD */}
      <div className="flex gap-2 justify-end">
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

        <AddBrandModal>+ Add Brand</AddBrandModal>
      </div>

      {/* TABLE */}
      <DataTable columns={columns} data={filteredData} />

      {/* EDIT MODAL */}
      {selectedBrand && (
        <EditBrandModal
          open={editOpen}
          onOpenChange={setEditOpen}
          data={selectedBrand}
        />
      )}
    </div>
  );
}

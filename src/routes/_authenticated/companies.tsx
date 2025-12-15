import { useState, useMemo } from "react";
import AddCompanyModal from "@/components/modals/AddCompanyModal";
import EditCompanyModal from "@/components/modals/EditCompanyModal";
import { deleteCompany, getAllCompanies } from "@/api/companies";
import { formatDate } from "../../lib/helpers";
import { DataTable } from "@/components/DataTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { SearchIcon, Edit, MoreHorizontal, Trash2 } from "lucide-react";
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
import type { Companies } from "@/types/companies";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/companies")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<Companies[]>({
    queryKey: ["companies"],
    queryFn: getAllCompanies,
  });

  const [editOpen, setEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Companies | null>(null);
  const [search, setSearch] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: () => {
      toast.success("Company deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: () => toast.error("Failed to delete company"),
  });

  const columnHelper = createColumnHelper<Companies>();
  const columns = [
    columnHelper.accessor("id", { header: () => "ID" }),
    columnHelper.accessor("name", { header: () => "Name" }),
    columnHelper.accessor("createdAt", {
      header: () => "Created At",
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue() as string | Date) : "",
    }),
    columnHelper.accessor("updatedAt", {
      header: () => "Updated At",
      cell: (info) =>
        info.getValue() ? formatDate(info.getValue() as string | Date) : "",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const company = row.original;
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
                    setSelectedCompany(company);
                    setEditOpen(true);
                  }}
                >
                  <Edit className="text-orange-400" />
                  Edit
                </DropdownMenuItem>

                {/* 🗑️ Delete */}
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
                      <AlertDialogTitle>Delete Company</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <b>{company.name}</b>? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(company.id)}
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

    return data.filter((item: Companies) => {
      return [item.id, item.name, item.createdAt, item.updatedAt]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(lower));
    });
  }, [data, search]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      {/* Search Bar + Add Button */}
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

        <AddCompanyModal>+ Add Company</AddCompanyModal>
      </div>

      {/*  Data Table */}
      <DataTable<Companies, any> columns={columns} data={filteredData} />

      {/*  Edit Company Modal */}
      {selectedCompany && (
        <EditCompanyModal
          open={editOpen}
          onOpenChange={setEditOpen}
          data={selectedCompany}
        />
      )}
    </div>
  );
}

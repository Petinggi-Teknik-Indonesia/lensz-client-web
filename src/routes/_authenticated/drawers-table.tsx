import { useState, useMemo } from "react";
import AddDrawerModal from "@/components/modals/AddDrawerModal";
import { getAllDrawers } from "@/api/glassesDependencies";
import { DataTable } from "@/components/DataTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { formatDate } from "@/api/glassesDependencies";
/*import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; */
import type { Drawers } from "@/types/drawers";

export const Route = createFileRoute("/_authenticated/drawers-table")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["drawers"],
    queryFn: getAllDrawers,
  });

  const [search, setSearch] = useState("");

  const columnHelper = createColumnHelper<Drawers>();
  const columns = [
    columnHelper.accessor("ID", { header: () => "ID" }),
    columnHelper.accessor("name", { header: () => "Name" }),
    columnHelper.accessor("CreatedAt", {
      header: () => "Created At",
      cell: info => info.getValue() ? formatDate(info.getValue() as string) : "",
    }),
    columnHelper.accessor("UpdatedAt", {
      header: () => "Updated At",
      cell: info => info.getValue() ? formatDate(info.getValue() as string) : "",
    }),
  ];

  // ✅ Filter by search 
  const filteredData = useMemo(() => {
    if (!data) return [];
    const lower = search.toLowerCase();

    return data.filter((item: Drawers) => {
      return [item.id, item.name, item.createdAt, item.updatedAt]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(lower));
    });
  }, [data, search]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      {/* 🔍 Search Bar + Add Button */}
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

        {/* Add Button */}
        <AddDrawerModal>
          + Add Drawer
        </AddDrawerModal>
      </div>

      {/* 📋 Data Table */}
      <DataTable<Drawers, any> columns={columns} data={filteredData} />
    </div>
  );
}

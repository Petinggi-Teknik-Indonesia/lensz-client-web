import { useState, useMemo } from "react";
import { getAllGlasses } from "@/api/glasses";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { Glasses } from "@/types/glasses";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddGlassesModal from "@/components/modals/AddGlassesModal";

export const Route = createFileRoute("/_authenticated/eyeglasses")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["glasses"],
    queryFn: getAllGlasses,
  });

  const [search, setSearch] = useState("");
  // use a non-empty sentinel value for "All"
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const columnHelper = createColumnHelper<Glasses>();
  const columns = [
    columnHelper.accessor("id", { header: () => "ID" }),
    columnHelper.accessor("name", { header: () => "Name" }),
    columnHelper.accessor("drawer", { header: () => "Drawers" }),
    columnHelper.accessor("status", { header: () => "Status" }),
    columnHelper.accessor("color", { header: () => "Color" }),
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
      const matchesSearch = [item.id, item.name, item.drawer, item.status, item.color]
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
        <AddGlassesModal>
          + Add Glasses
        </AddGlassesModal>
      </div>

      {/* 📋 Data Table */}
      <DataTable<Glasses, any> columns={columns} data={filteredData} />
    </div>
  );
}

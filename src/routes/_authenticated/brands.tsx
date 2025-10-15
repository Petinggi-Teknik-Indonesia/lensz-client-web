import { getAllBrands } from "@/api/glassesDependencies";
import { DataTable } from "@/components/DataTable";
import AddGlassesModal from "@/components/modals/AddGlassesModal";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router"
import { createColumnHelper } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// const items = [
//   { kacamata: "Oakley Radar EV", brand: "Oakley" },
//   { kacamata: "Ray-Ban Wayfarer", brand: "Ray-Ban" },
//   { kacamata: "Gucci GG0061S", brand: "Gucci" },
//   { kacamata: "Prada Linea Rossa", brand: "Prada" },
//   { kacamata: "Nike Trainer", brand: "Nike" },
//   { kacamata: "Versace VE2166", brand: "Versace" },
//   { kacamata: "Police SPL872", brand: "Police" },
// ]

// export function TableDemo() {
//   return (
//     <Table>
//       <TableCaption>Daftar koleksi kacamata dan merek.</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[200px]">Kacamata</TableHead>
//           <TableHead>Brand</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {items.map((item) => (
//           <TableRow key={item.kacamata}>
//             <TableCell className="font-medium">{item.kacamata}</TableCell>
//             <TableCell>{item.brand}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//       <TableFooter >
//         <TableRow>
//           <TableCell colSpan={2}>Total: {items.length} items</TableCell>
//         </TableRow>
//       </TableFooter>
//     </Table>
//   )
// }



export const Route = createFileRoute("/_authenticated/brands")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
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
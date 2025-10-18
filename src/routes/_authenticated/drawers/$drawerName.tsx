import { useState, useMemo } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { getGlassesByDrawer } from "@/api/glasses";
import { DataTable } from "@/components/DataTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import type { Glasses } from "@/types/glasses";

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

  const [search, setSearch] = useState("");

  const columnHelper = createColumnHelper<Glasses>();
  const columns = [
    columnHelper.accessor("id", { header: () => "ID" }),
    columnHelper.accessor("name", { header: () => "Name" }),
    columnHelper.accessor("drawer", { header: () => "Drawer" }),
    columnHelper.accessor("status", { header: () => "Status" }),
    columnHelper.accessor("color", { header: () => "Color" }),
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
    </div>
  );
}

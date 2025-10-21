import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { getGlasses } from "@/api/glasses";
import { DataTable } from "@/components/DataTable";
import {

  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import type { Glasses } from "@/types/glasses";

export const Route = createFileRoute("/_authenticated/eyeglasses-description/$glassesid")({
  component: Description,
});

function Description() {
  const { glassesid } = useParams({
    from: "/_authenticated/eyeglasses-description/$glassesid",
  });

  const id = Number(glassesid);

  // 🧠 Fetch glasses inside this drawer
  const { data } = useQuery({
    queryKey: ["glasses", id],
    queryFn: () => getGlasses(id),
    enabled: !!id, // only fetch when glassesid is truthy
  });

  const [search, setSearch] = useState("");

  const columnHelper = createColumnHelper<Glasses>(); 
  const columns = [
  columnHelper.display({
    id: "main",
    header: "Eyeglasses",
    cell: (info) => (
      <div className="flex flex-col gap-1">
        {/* Nama & Status */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">{info.row.original.name}</span>
          <span className="text-sm text-gray-600">{info.row.original.status}</span>
        </div>

        {/* Deskripsi */}
        <div>
          <span className="font-medium">Deskripsi:</span>
          <p className="text-gray-700 mt-1">
            Ini adalah Kacamata "{info.row.original.name}" dengan status "{info.row.original.status}" tipe "{info.row.original.type}", dari company "{info.row.original.company}", brand "{info.row.original.brand}".
          </p>
        </div>

        {/* Company, Brand, Type */}
        <div className="text-sm text-gray-500">
          <div>Company: {info.row.original.company}</div>
          <div>Brand: {info.row.original.brand}</div>
          <div>Type: {info.row.original.type}</div>
        </div>
      </div>
    ),
  }),
];


  return (
    <div className="h-full flex flex-col gap-2 mt-2">
      {/* 🏷 Drawer Title */}
      <h1 className="text-2xl font-semibold mb-2">ID : {glassesid}</h1>

      

      <DataTable<Glasses, any> columns={columns} data={data ? [data] : []} />
    </div>
  );
}

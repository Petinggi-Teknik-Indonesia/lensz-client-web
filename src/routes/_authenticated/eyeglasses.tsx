import { getAllGlasses } from "@/api/glasses";
import { DataTable } from "@/components/DataTable";
import type { Glasses } from "@/types/glasses";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from '@tanstack/react-table'


export const Route = createFileRoute("/_authenticated/eyeglasses")({
  component: RouteComponent,
});

const Glassess = [
  {
    id: "K001",
    tipe: "Sport",
    warna: "Hitam",
    status: "Available",
    description: "Glasses sport dengan frame ringan dan lensa anti-UV.",
    log: "Added 2 days ago",
  },
  {
    id: "K002",
    tipe: "Casual",
    warna: "Coklat",
    status: "Rented",
    description: "Model klasik untuk penggunaan harian.",
    log: "Last rented yesterday",
  },
  {
    id: "K003",
    tipe: "Fashion",
    warna: "Putih",
    status: "Available",
    description: "Glasses gaya modern cocok untuk acara formal.",
    log: "Added last week",
  },
  {
    id: "K004",
    tipe: "Outdoor",
    warna: "Abu-abu",
    status: "Maintenance",
    description: "Lensa polarized untuk aktivitas luar ruangan.",
    log: "Under maintenance",
  },
  {
    id: "K005",
    tipe: "Reading",
    warna: "Hitam",
    status: "Available",
    description: "Glasses baca dengan frame kuat dan ringan.",
    log: "Updated 3 hours ago",
  },
]

function RouteComponent() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["glasses"],
    queryFn: getAllGlasses,
  });
  const columnHelper = createColumnHelper<Glasses>();

  const columns = [
    columnHelper.accessor("Rfid", {
      header: () => "RFID",
    }),
    columnHelper.accessor("Name", {
      header: () => "Name",
    }),
    columnHelper.accessor("Type", {
      header: () => "type",
    }),
    columnHelper.accessor("Drawer", {
      header: () => "Drawers",
    }),
    columnHelper.accessor("Company", {
      header: () => "Companies",
    }),
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <DataTable<Glasses, any> columns={columns} data={data ?? []} />
    </>
  );
}

import { getAllGlasses } from "@/api/glasses";
import { DataTable } from "@/components/DataTable";
import type { Glasses } from "@/types/glasses";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from '@tanstack/react-table'


export const Route = createFileRoute("/_authenticated/eyeglasses")({
  component: RouteComponent,
});

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

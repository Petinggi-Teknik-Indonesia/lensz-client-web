import { DataTable } from '@/components/DataTable'
import { data } from '@/lib/data'
import type { Glasses } from '@/types/glasses'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'

export const Route = createFileRoute('/_authenticated/test')({
  component: RouteComponent,
})

function RouteComponent() {
  const columnHelper = createColumnHelper<Glasses>();
  const columns = [
    columnHelper.accessor("rfid",{
      header: () =>"RFID"
    }),
    columnHelper.accessor("name",{
      header: () =>"Name"
    }),
    columnHelper.accessor("type",{
      header: () =>"type"
    }),
    columnHelper.accessor("drawer",{
      header: () =>"Drawers"
    }),
    columnHelper.accessor("company",{
      header: () =>"Companies"
    }),
  ] 

  return <div>
    <DataTable<Glasses, any> columns={columns} data={data}/>
  </div>
}

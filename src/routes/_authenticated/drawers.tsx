import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const Route = createFileRoute('/_authenticated/drawers')({
  component: RouteComponent,
})

const laciA = [
  { kacamata: "Ray-Ban Wayfarer" },
  { kacamata: "Oakley Holbrook" },
  { kacamata: "Prada PR01VS" },
]

const laciB = [
  { kacamata: "Gucci GG0061S" },
  { kacamata: "Tom Ford FT0551" },
  { kacamata: "Persol PO3019S" },
]

const laciC = [
  { kacamata: "Versace VE4361" },
  { kacamata: "Burberry BE4291U" },
  { kacamata: "Gentle Monster Maison" },
]

const laciD = [
  { kacamata: "Levi’s LV5001" },
  { kacamata: "Michael Kors MK2090U" },
  { kacamata: "Emporio Armani EA4177" },
]

function DrawerTable({ title, data }: { title: string; data: { kacamata: string }[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <Table>
        <TableCaption>Daftar kacamata di {title}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Kacamata</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.kacamata}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-semibold mb-4">Daftar Kacamata per Laci</h1>
      
      <DrawerTable title="Laci A" data={laciA} />
      <DrawerTable title="Laci B" data={laciB} />
      <DrawerTable title="Laci C" data={laciC} />
      <DrawerTable title="Laci D" data={laciD} />
    </div>
  )
}

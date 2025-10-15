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
  { Glasses: "Ray-Ban Wayfarer" },
  { Glasses: "Oakley Holbrook" },
  { Glasses: "Prada PR01VS" },
]

const laciB = [
  { Glasses: "Gucci GG0061S" },
  { Glasses: "Tom Ford FT0551" },
  { Glasses: "Persol PO3019S" },
]

const laciC = [
  { Glasses: "Versace VE4361" },
  { Glasses: "Burberry BE4291U" },
  { Glasses: "Gentle Monster Maison" },
]

const laciD = [
  { Glasses: "Levi’s LV5001" },
  { Glasses: "Michael Kors MK2090U" },
  { Glasses: "Emporio Armani EA4177" },
]

function DrawerTable({ title, data }: { title: string; data: { Glasses: string }[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <Table>
        <TableCaption>Daftar Glasses di {title}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Glasses</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.Glasses}</TableCell>
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
      <h1 className="text-2xl font-semibold mb-4">Daftar Glasses per Laci</h1>
      
      <DrawerTable title="Laci A" data={laciA} />
      <DrawerTable title="Laci B" data={laciB} />
      <DrawerTable title="Laci C" data={laciC} />
      <DrawerTable title="Laci D" data={laciD} />
    </div>
  )
}

import { createFileRoute } from "@tanstack/react-router"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const items = [
  { kacamata: "Oakley Radar EV", brand: "Oakley" },
  { kacamata: "Ray-Ban Wayfarer", brand: "Ray-Ban" },
  { kacamata: "Gucci GG0061S", brand: "Gucci" },
  { kacamata: "Prada Linea Rossa", brand: "Prada" },
  { kacamata: "Nike Trainer", brand: "Nike" },
  { kacamata: "Versace VE2166", brand: "Versace" },
  { kacamata: "Police SPL872", brand: "Police" },
]

export function TableDemo() {
  return (
    <Table>
      <TableCaption>Daftar koleksi kacamata dan merek.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Kacamata</TableHead>
          <TableHead>Brand</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.kacamata}>
            <TableCell className="font-medium">{item.kacamata}</TableCell>
            <TableCell>{item.brand}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total: {items.length} items</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

function RouteComponent() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-semibold">Brands & Kacamata</h1>
      <TableDemo />
    </div>
  )
}

export const Route = createFileRoute("/_authenticated/brands")({
  component: RouteComponent,
})

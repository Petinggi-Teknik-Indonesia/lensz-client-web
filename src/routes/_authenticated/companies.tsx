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

export const Route = createFileRoute('/_authenticated/companies')({
  component: RouteComponent,
})

const products = [
  { kacamata: "Ray-Ban Wayfarer", company: "Ray-Ban" },
  { kacamata: "Oakley Holbrook", company: "Oakley Inc." },
  { kacamata: "Gucci GG0061S", company: "Gucci" },
  { kacamata: "Prada PR01VS", company: "Prada" },
  { kacamata: "Persol PO3019S", company: "Persol" },
  { kacamata: "Tom Ford FT0551", company: "Tom Ford" },
]

function RouteComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Daftar Kacamata & Companies</h1>

      <Table>
        <TableCaption>List of sunglasses and their respective companies.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Kacamata</TableHead>
            <TableHead>Companies</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.kacamata}</TableCell>
              <TableCell>{item.company}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

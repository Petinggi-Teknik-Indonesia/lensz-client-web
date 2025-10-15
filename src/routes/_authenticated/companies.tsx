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
  { Glasses: "Ray-Ban Wayfarer", company: "Ray-Ban" },
  { Glasses: "Oakley Holbrook", company: "Oakley Inc." },
  { Glasses: "Gucci GG0061S", company: "Gucci" },
  { Glasses: "Prada PR01VS", company: "Prada" },
  { Glasses: "Persol PO3019S", company: "Persol" },
  { Glasses: "Tom Ford FT0551", company: "Tom Ford" },
]

function RouteComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Daftar Glasses & Companies</h1>

      <Table>
        <TableCaption>List of sunglasses and their respective companies.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Glasses</TableHead>
            <TableHead>Companies</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.Glasses}</TableCell>
              <TableCell>{item.company}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

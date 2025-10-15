import { createFileRoute } from '@tanstack/react-router'
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
  {
    rfid: "RFID001",
    name: "Glasses Ray-Ban",
    type: "Sunglasses",
    company: "Ray-Ban",
  },
  {
    rfid: "RFID002",
    name: "Glasses Oakley",
    type: "Sport",
    company: "Oakley",
  },
  {
    rfid: "RFID003",
    name: "Glasses Gucci",
    type: "Luxury",
    company: "Gucci",
  },
  {
    rfid: "RFID004",
    name: "Glasses Gentle Monster",
    type: "Fashion",
    company: "Gentle Monster",
  },
  {
    rfid: "RFID005",
    name: "Glasses Uniqlo",
    type: "Daily",
    company: "Uniqlo",
  },
]

export const Route = createFileRoute('/_authenticated/laci-b')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Laci B - Daftar Glasses</h1>
      <Table>
        <TableCaption>List of all glasses stored in Laci A.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">RFID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.rfid}>
              <TableCell className="font-medium">{item.rfid}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.company}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Items</TableCell>
            <TableCell className="text-right">{items.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

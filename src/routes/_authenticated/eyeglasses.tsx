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

export const Route = createFileRoute('/_authenticated/eyeglasses')({
  component: RouteComponent,
})

const kacamatas = [
  {
    id: "K001",
    tipe: "Sport",
    warna: "Hitam",
    status: "Available",
    description: "Kacamata sport dengan frame ringan dan lensa anti-UV.",
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
    description: "Kacamata gaya modern cocok untuk acara formal.",
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
    description: "Kacamata baca dengan frame kuat dan ringan.",
    log: "Updated 3 hours ago",
  },
]

function RouteComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Data Kacamata</h1>

      <Table>
        <TableCaption>List of all registered kacamata items.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Kacamata</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Warna</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Log</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {kacamatas.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{`Kacamata ${index + 1}`}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.tipe}</TableCell>
              <TableCell>{item.warna}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.log}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>Total: {kacamatas.length} items</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

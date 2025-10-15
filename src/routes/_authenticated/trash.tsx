"use client"

import * as React from "react"
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
import { Button } from "@/components/ui/button"

// Data dummy Glasses dengan lokasi laci A–D
const eyeglasses = [
  {
    rfid: "RFID001",
    name: "Ray-Ban Wayfarer",
    type: "Sunglasses",
    drawers: "Laci A",
    company: "Ray-Ban",
  },
  {
    rfid: "RFID002",
    name: "Oakley Sport",
    type: "Sport",
    drawers: "Laci B",
    company: "Oakley",
  },
  {
    rfid: "RFID003",
    name: "Gucci Classic",
    type: "Fashion",
    drawers: "Laci C",
    company: "Gucci",
  },
  {
    rfid: "RFID004",
    name: "Minus Lens 1.75",
    type: "Reading",
    drawers: "Laci D",
    company: "Essilor",
  },
]

export const Route = createFileRoute("/_authenticated/trash")({
  component: RouteComponent,
})

function RouteComponent() {
  const [data, setData] = React.useState(eyeglasses)

  function handleDelete(rfid: string) {
    const confirmDelete = confirm(`Apakah kamu yakin ingin menghapus Glasses ${rfid}?`)
    if (!confirmDelete) return

    const updated = data.filter((item) => item.rfid !== rfid)
    setData(updated)

    console.log(`Deleted eyeglass with RFID: ${rfid}`)
    // TODO: panggil API delete jika backend tersedia
  }

  function handleRecover(rfid: string) {
    const confirmRecover = confirm(`Pulihkan Glasses ${rfid} dari trash?`)
    if (!confirmRecover) return

    const updated = data.filter((item) => item.rfid !== rfid)
    setData(updated)

    console.log(`Recovered eyeglass with RFID: ${rfid}`)
    // TODO: panggil API recover/restore jika backend tersedia
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Deleted Eyeglasses</h1>
      <Table>
        <TableCaption>Daftar Glasses yang telah dihapus (soft delete).</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">RFID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Drawers</TableHead>
            <TableHead>Companies</TableHead>
            <TableHead className="text-center w-[120px]">Recover</TableHead>
            <TableHead className="text-center w-[150px]">Delete Glasses</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((glass) => (
              <TableRow key={glass.rfid}>
                <TableCell className="font-medium">{glass.rfid}</TableCell>
                <TableCell>{glass.name}</TableCell>
                <TableCell>{glass.type}</TableCell>
                <TableCell>{glass.drawers}</TableCell>
                <TableCell>{glass.company}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRecover(glass.rfid)}
                  >
                    Recover
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(glass.rfid)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Tidak ada Glasses yang dihapus.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total</TableCell>
            <TableCell className="text-right">{data.length} items</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

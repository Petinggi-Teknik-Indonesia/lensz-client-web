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

const items = [
  { Glasses: "Oakley Radar EV", brand: "Oakley" },
  { Glasses: "Ray-Ban Wayfarer", brand: "Ray-Ban" },
  { Glasses: "Gucci GG0061S", brand: "Gucci" },
  { Glasses: "Prada Linea Rossa", brand: "Prada" },
  { Glasses: "Nike Trainer", brand: "Nike" },
  { Glasses: "Versace VE2166", brand: "Versace" },
  { Glasses: "Police SPL872", brand: "Police" },
]

export function TableDemo() {
  return (
    <Table>
      <TableCaption>Daftar koleksi Glasses dan merek.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Glasses</TableHead>
          <TableHead>Brand</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.Glasses}>
            <TableCell className="font-medium">{item.Glasses}</TableCell>
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
      <h1 className="mb-4 text-lg font-semibold">Brands & Glasses</h1>
      <TableDemo />
    </div>
  )
}

export const Route = createFileRoute("/_authenticated/brands")({
  component: RouteComponent,
})

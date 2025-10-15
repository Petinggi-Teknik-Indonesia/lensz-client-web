"use client"

import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_authenticated/add-glasses")({
  component: RouteComponent,
})

function AddGlassesForm() {
  const [rfid, setRfid] = React.useState("")
  const [name, setName] = React.useState("")
  const [type, setType] = React.useState("")
  const [drawer, setDrawer] = React.useState("Laci A")
  const [company, setCompany] = React.useState("")

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!rfid.trim()) e.rfid = "RFID is required"
    if (!name.trim()) e.name = "Name is required"
    if (!type.trim()) e.type = "Type is required"
    if (!drawer.trim()) e.drawer = "Drawer is required"
    if (!company.trim()) e.company = "Company is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload = { rfid, name, type, drawer, company }
    console.log("Add Glasses payload:", payload)
    alert("New eyeglass added (UI only). Check console for payload.")

    // reset form
    setRfid("")
    setName("")
    setType("")
    setDrawer("Laci A")
    setCompany("")
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Add New Eyeglass</h2>
      <p className="text-sm text-muted-foreground">
        Fill all required fields to add a new eyeglass (UI only).
      </p>

      {/* RFID */}
      <div className="grid gap-1">
        <label className="text-sm font-medium">RFID <span className="text-destructive">*</span></label>
        <input
          value={rfid}
          onChange={(e) => setRfid(e.target.value)}
          placeholder="e.g. RFID001"
          className="rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.rfid && <p className="text-sm text-destructive">{errors.rfid}</p>}
      </div>

      {/* Name */}
      <div className="grid gap-1">
        <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Model name (e.g. Ray-Ban Wayfarer)"
          className="rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      {/* Type */}
      <div className="grid gap-1">
        <label className="text-sm font-medium">Type <span className="text-destructive">*</span></label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Select type</option>
          <option value="SunGlasses">SunGlasses</option>
          <option value="Sport">Sport</option>
          <option value="Fashion">Fashion</option>
          <option value="Reading">Reading</option>
          <option value="Daily">Daily</option>
        </select>
        {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
      </div>

      {/* Drawers */}
      <div className="grid gap-1">
        <label className="text-sm font-medium">Drawers <span className="text-destructive">*</span></label>
        <select
          value={drawer}
          onChange={(e) => setDrawer(e.target.value)}
          className="rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="Laci A">Laci A</option>
          <option value="Laci B">Laci B</option>
          <option value="Laci C">Laci C</option>
          <option value="Laci D">Laci D</option>
        </select>
        {errors.drawer && <p className="text-sm text-destructive">{errors.drawer}</p>}
      </div>

      {/* Companies */}
      <div className="grid gap-1">
        <label className="text-sm font-medium">Companies <span className="text-destructive">*</span></label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Manufacturer or brand"
          className="rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit">Add Glasses</Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setRfid("")
            setName("")
            setType("")
            setDrawer("Laci A")
            setCompany("")
            setErrors({})
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  )
}

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto py-10">
        <AddGlassesForm />
      </main>
    </div>
  )
}

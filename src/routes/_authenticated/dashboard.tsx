"use client"

import * as React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
})

function StatCard({
  title,
  value,
  hint,
}: {
  title: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        <span className="mt-1 text-2xl font-semibold">{value}</span>
        {hint && <span className="mt-1 text-sm text-muted-foreground">{hint}</span>}
      </div>
    </div>
  )
}

function QuickAction({
  to,
  title,
  subtitle,
}: {
  to: string
  title: string
  subtitle?: string
}) {
  return (
    <Link to={to} className="block">
      <div className="rounded-lg border bg-card p-4 hover:bg-accent hover:text-accent-foreground transition">
        <h3 className="font-medium">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </Link>
  )
}

function RouteComponent() {
  const stats = {
    total: 128,
    available: 86,
    trash: 5,
    brands: 12,
    companies: 8,
  }

  const [search, setSearch] = React.useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage all eyeglass-related data
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:w-64"
            />
            <div className="flex gap-2">
              <Link to="/add-Glasses">
                <Button>Add Glasses</Button>
              </Link>
              <Link to="/trash">
                <Button variant="secondary">Trash</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Glasses" value={stats.total} hint={`${stats.available} available`} />
          <StatCard title="In Trash" value={stats.trash} hint="Soft deleted items" />
          <StatCard title="Brands" value={stats.brands} hint="Managed brands" />
          <StatCard title="Companies" value={stats.companies} hint="Company partners" />
        </div>

        {/* Quick Access */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction to="/add-Glasses" title="Add Glasses" subtitle="Add a new eyeglass" />
            <QuickAction to="/eyeGlasses" title="Glasses" subtitle="View all active eyeGlasses" />
            <QuickAction to="/Glasses-table" title="Tabel Glasses" subtitle="Full data overview" />
            <QuickAction to="/trash" title="Trash" subtitle="Manage deleted items" />
          </div>
        </section>

        {/* Main Menu */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Menu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickAction to="/add-Glasses" title="Add Glasses" subtitle="Add new eyeglass to database" />
            <QuickAction to="/eyeGlasses" title="Glasses" subtitle="View all eyeGlasses" />
            <QuickAction to="/Glasses-table" title="Glasses Table" subtitle="Detailed table view" />
            <QuickAction to="/Glasses-status" title="Status Glasses" subtitle="Availability overview" />
            <QuickAction to="/brands" title="Brands" subtitle="Manage eyeglass brands" />
            <QuickAction to="/companies" title="Companies" subtitle="Manage partner companies" />
          </div>
        </section>
      </main>
    </div>
  )
}

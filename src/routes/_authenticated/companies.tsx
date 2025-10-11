import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/companies')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/suppliers"!</div>
}

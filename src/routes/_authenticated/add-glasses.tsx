import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/add-glasses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/add-glasses"!</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/glasses-table')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/glasses-table"!</div>
}

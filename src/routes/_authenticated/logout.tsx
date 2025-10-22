import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/logout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/logout"!</div>
}

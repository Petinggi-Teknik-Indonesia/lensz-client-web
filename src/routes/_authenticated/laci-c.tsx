import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/laci-c')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/laci-c"!</div>
}

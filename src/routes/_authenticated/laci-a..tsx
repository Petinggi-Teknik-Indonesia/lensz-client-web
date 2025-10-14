import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/laci-a/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/laci-a/"!</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/drawers')({
  component: RouteComponent,
})

function RouteComponent() {
  
  return <div>
    hello world
  </div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(preAuth)/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/register"!</div>
}

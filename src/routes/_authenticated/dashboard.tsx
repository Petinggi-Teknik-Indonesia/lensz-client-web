import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h1>Welcome to Lenz!</h1>
    </div>

}

import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
        <div>
            Landing
            <Button>
                Testing
            </Button>
            <Button variant="secondary">
                Testing
            </Button>
            <Button variant="outline">
                Testing
            </Button>
            <Button variant="ghost">
                Testing
            </Button>
        </div>
    </>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute('/_authenticated/scanners')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex flex-col gap-6'>
      
      <h1 className='text-center text-xl font-semibold'>Scanners</h1>
      <div className='flex flex-col sm:flex-row gap-3 justify-between items-center'>
        <Input 
          placeholder="Search scanner..." 
          className="max-w-sm"
        />
        <Button variant="default" className="px-4">
          + Add Scanner
        </Button>
      </div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Scanner A</CardTitle>
            <CardDescription>Online</CardDescription>
          </CardHeader>
          <CardFooter>
            Last Active: 2025-11-15
          </CardFooter>
        </Card>

        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Scanner B</CardTitle>
            <CardDescription>Online</CardDescription>
          </CardHeader>
          <CardFooter>
            Last Active: 2025-11-15
          </CardFooter>
        </Card>

        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Scanner C</CardTitle>
            <CardDescription>Offline</CardDescription>
          </CardHeader>
          <CardFooter>
            Last Active: 2025-11-12
          </CardFooter>
        </Card>

        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Scanner D</CardTitle>
            <CardDescription>Online</CardDescription>
          </CardHeader>
          <CardFooter>
            Last Active: 2025-11-15
          </CardFooter>
        </Card>

        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Scanner E</CardTitle>
            <CardDescription>Online</CardDescription>
          </CardHeader>
          <CardFooter>
            Last Active: 2025-11-15
          </CardFooter>
        </Card>

      </div>

    </div>
  )
}

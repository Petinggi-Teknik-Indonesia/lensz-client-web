import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
    style ={{ backgroundColor: '#012583'}}>
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}


export const Route = createFileRoute('/_preAuth/register')({
  component: RegisterPage,
})



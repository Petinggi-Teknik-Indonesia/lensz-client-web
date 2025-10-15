import { createFileRoute } from "@tanstack/react-router"
import { LoginForm } from "@/components/login-form"

function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
    style ={{ backgroundColor: '#012583'}}>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/_preAuth/login")({
  component: LoginPage,
})

export default LoginPage

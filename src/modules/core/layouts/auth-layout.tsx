import { Outlet } from "react-router"
import { ShieldCheck } from "lucide-react"

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-muted/40 p-4">
      
      {/* Logo / Título */}
      <div className="mb-8 flex items-center gap-2 text-primary animate-in fade-in slide-in-from-top-4 duration-500">
        <ShieldCheck className="h-8 w-8" />
        <h1 className="text-2xl font-bold tracking-tight">tenats management</h1>
      </div>

      {/* Aquí se inyecta tu Login */}
      <Outlet />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Sistema de Gestión.
      </div>
    </div>
  )
}
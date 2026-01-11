import { Link, Outlet, useLocation } from "react-router"
import {
  Home,
  Menu,
  Users,
  CreditCard,
  Building2,
  LogOut
} from "lucide-react"

import { Button } from "../components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "../components/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar"

export const AdminLayout = () => {
  const location = useLocation();

  // Función auxiliar para resaltar el link activo
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
      isActive ? "bg-muted text-primary" : "text-muted-foreground"
    }`;
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      
      {/* 1. SIDEBAR (Solo visible en Escritorio) */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          
          {/* Logo / Título */}
          <div className="flex h-14 items-center border-b px-4 lg:h-15 lg:px-6">
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
              <Building2 className="h-6 w-6" />
              <span className="">Gestión Alquileres</span>
            </Link>
          </div>

          {/* Menú de Navegación */}
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link to="/dashboard" className={getLinkClass("/dashboard")}>
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/dashboard/tenants" className={getLinkClass("/dashboard/tenants")}>
                <Users className="h-4 w-4" />
                Inquilinos
              </Link>
              <Link to="/dashboard/transactions" className={getLinkClass("/dashboard/transactions")}>
                <CreditCard className="h-4 w-4" />
                Transacciones
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* 2. ÁREA PRINCIPAL */}
      <div className="flex flex-col">
        
        {/* Header Superior (Móvil y Escritorio) */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-15 lg:px-6">
          
          {/* Botón Menú Móvil (Solo visible en pantallas pequeñas) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                  <Building2 className="h-6 w-6" />
                  <span className="sr-only">Gestión Alquileres</span>
                </Link>
                <Link to="/dashboard" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link to="/dashboard/tenants" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Users className="h-5 w-5" />
                  Inquilinos
                </Link>
                <Link to="/dashboard/transactions" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <CreditCard className="h-5 w-5" />
                  Transacciones
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Espaciador para empujar el menú de usuario a la derecha */}
          <div className="w-full flex-1">
            {/* Aquí podrías poner una barra de búsqueda si quisieras */}
          </div>

          {/* Menú de Usuario (Dropdown) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                    <AvatarImage src="" /> {/* Aquí iría la URL de la foto */}
                    <AvatarFallback>CN</AvatarFallback> {/* Iniciales */}
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* 3. CONTENIDO DINÁMICO (Outlet) */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-slate-50/50">
           {/* Aquí se renderizarán las páginas hijas (DashboardHome, Tenants, etc.) */}
           <Outlet />
        </main>
      </div>
    </div>
  )
}
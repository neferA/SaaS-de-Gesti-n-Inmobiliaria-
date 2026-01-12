import { Search, MoreHorizontal, Shield, UserCog, Trash2, Ban } from "lucide-react"

import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import { Badge } from "@/modules/core/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/core/components/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/core/components/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/core/components/card"

// Importamos el Modal que acabamos de crear
import { CreateUserDialog } from "./create-user-dialog"

// Datos simulados (Mock Data) con estructura Prisma
const users = [
  { 
    id: 1, 
    firstName: "Admin", 
    lastName: "Principal", 
    email: "admin@empresa.com", 
    role: "admin", 
    status: "active" 
  },
  { 
    id: 2, 
    firstName: "Pedro", 
    lastName: "Soporte", 
    email: "soporte@empresa.com", 
    role: "staff", 
    status: "active" 
  },
  { 
    id: 3, 
    firstName: "Juan", 
    lastName: "Auditor", 
    email: "auditor@gmail.com", 
    role: "viewer", 
    status: "inactive" 
  },
]

export const UsersPage = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. HEADER: Título y Botón de Crear */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuarios del Sistema</h2>
          <p className="text-muted-foreground">Gestiona los accesos y roles administrativos.</p>
        </div>
        {/* Aquí usamos el componente del Modal */}
        <CreateUserDialog />
      </div>

      {/* 2. BARRA DE HERRAMIENTAS (Buscador) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar por nombre..." className="pl-8" />
        </div>
      </div>

      {/* 3. TABLA DE DATOS */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Registrado</CardTitle>
          <CardDescription>
            Lista de personas con credenciales de acceso al panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span className="flex items-center gap-2">
                            {/* Icono según rol */}
                            {user.role === 'admin' ? (
                                <Shield className="h-3 w-3 text-primary" /> 
                            ) : (
                                <UserCog className="h-3 w-3 text-muted-foreground" />
                            )}
                            {/* Nombre Completo Combinado */}
                            {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground pl-5">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* Badges de Roles */}
                    {user.role === 'admin' && <Badge variant="default">Admin</Badge>}
                    {user.role === 'staff' && <Badge variant="secondary">Staff</Badge>}
                    {user.role === 'viewer' && <Badge variant="outline">Observador</Badge>}
                  </TableCell>
                  <TableCell>
                    {/* Indicador de Estado */}
                    {user.status === 'active' 
                        ? <span className="text-green-600 text-xs font-bold flex items-center gap-1">● Activo</span> 
                        : <span className="text-red-500 text-xs font-bold flex items-center gap-1">● Bloqueado</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuItem>Editar Datos</DropdownMenuItem>
                        <DropdownMenuItem>Restablecer Password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                            {user.status === 'active' ? (
                                <><Ban className="mr-2 h-4 w-4"/> Bloquear Acceso</>
                            ) : (
                                <><Trash2 className="mr-2 h-4 w-4"/> Eliminar Definitivamente</>
                            )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
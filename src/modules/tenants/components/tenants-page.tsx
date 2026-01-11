import { Search, MoreHorizontal, FileEdit, Trash2, Phone } from "lucide-react"

import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import { Badge } from "@/modules/core/components/badge" 
import { CreateTenantDialog } from "./create-tenant-dialog"
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

// Datos de prueba (Mock Data)
const tenants = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@gmail.com",
    phone: "707-12345",
    unit: "Dpto 101",
    status: "active", // active, late, inactive
    entryDate: "2023-05-01",
  },
  {
    id: "2",
    name: "María Gonzales",
    email: "maria.g@hotmail.com",
    phone: "654-98765",
    unit: "Dpto 102",
    status: "late",
    entryDate: "2023-08-15",
  },
  {
    id: "3",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@yahoo.com",
    phone: "777-55555",
    unit: "Habitación 3",
    status: "inactive",
    entryDate: "2022-01-10",
  },
]

export const TenantsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. HEADER: Título y Botón de Crear */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inquilinos</h2>
          <p className="text-muted-foreground">Gestiona los contratos y residentes.</p>
        </div>
        <CreateTenantDialog />
      </div>

      {/* 2. FILTROS Y BÚSQUEDA */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o dpto..."
              className="pl-8"
            />
        </div>
        {/* Aquí podrías agregar un filtro por Estado */}
      </div>

      {/* 3. TABLA DE DATOS */}
      <Card>
        <CardHeader>
          <CardTitle>Listado General</CardTitle>
          <CardDescription>
            Tienes {tenants.length} inquilinos registrados en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Unidad/Dpto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Contacto</TableHead>
                <TableHead className="hidden md:table-cell">Fecha Ingreso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{tenant.name}</span>
                        <span className="text-xs text-muted-foreground md:hidden">{tenant.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tenant.unit}</TableCell>
                  <TableCell>
                    {/* Renderizado condicional del Badge según estado */}
                    {tenant.status === 'active' && <Badge className="bg-green-500 hover:bg-green-600">Al día</Badge>}
                    {tenant.status === 'late' && <Badge variant="destructive">Mora</Badge>}
                    {tenant.status === 'inactive' && <Badge variant="secondary">Inactivo</Badge>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col text-sm">
                        <span>{tenant.email}</span>
                        <span className="text-muted-foreground text-xs">{tenant.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tenant.entryDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" /> Contactar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <FileEdit className="mr-2 h-4 w-4" /> Editar Datos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
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
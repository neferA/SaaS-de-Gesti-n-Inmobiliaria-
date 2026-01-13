import { Search, MoreHorizontal, FileEdit, Trash2, Phone, CreditCard } from "lucide-react"
import { useState } from "react"
import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/modules/core/components/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/modules/core/components/dropdown-menu"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/modules/core/components/card"

import { CreateTenantDialog } from "./create-tenant-dialog"
import { EditTenantDialog } from "./edit-tenant-dialog"

// Mock Data ajustado a tu Modelo Prisma (Tenant)
const tenants = [
  {
    id: "1",
    fullName: "Juan Pérez",
    ci: "5423123 SC",
    phone: "707-12345",
  },
  {
    id: "2",
    fullName: "María Gonzales",
    ci: "8977654 CB",
    phone: "654-98765",
  },
  {
    id: "3",
    fullName: "Carlos Ruiz",
    ci: "1122334 LP",
    phone: "777-55555",
  },
]

export const TenantsPage = () => {
  // 3. Crear Estados para controlar la edición
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)

  // 4. Función auxiliar para abrir el modal
  const handleEditClick = (tenant: any) => {
    setSelectedTenant(tenant)
    setIsEditOpen(true)
  }
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inquilinos</h2>
          <p className="text-muted-foreground">Gestiona los residentes registrados.</p>
        </div>
        <CreateTenantDialog />
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o CI..."
              className="pl-8"
            />
        </div>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Listado General</CardTitle>
          <CardDescription>
            Tienes {tenants.length} inquilinos registrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Cédula (CI)</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">
                    {tenant.fullName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                        {tenant.ci}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {tenant.phone || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(tenant)}>
                            <FileEdit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
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
      <EditTenantDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        data={selectedTenant} 
      />
    </div>
  )
}
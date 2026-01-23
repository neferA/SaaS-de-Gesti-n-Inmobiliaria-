import { useState, useEffect } from "react"
import { Search, MoreHorizontal, FileEdit, Phone, CreditCard, Loader2, UserX, LogOut } from "lucide-react"
import { toast } from "sonner"

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
import { tenantsService, type Tenant } from "../services/tenants.service"
import { CheckoutTenantDialog } from "./checkout-tenant-dialog"

export const TenantsPage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)  
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  
  // 1. ESTADO PARA EL BUSCADOR
  const [searchTerm, setSearchTerm] = useState("")

  const fetchTenants = async () => {
    try {
      setLoading(true)
      const data = await tenantsService.getAll()
      setTenants(data)
    } catch (error) {
      console.error("Error cargando inquilinos:", error)
      toast.error("Error al cargar la lista")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  // 2. LÓGICA DE FILTRADO (Nombre, CI o Teléfono)
  const filteredTenants = tenants.filter(tenant => {
    const term = searchTerm.toLowerCase()
    return (
        tenant.fullName.toLowerCase().includes(term) || // Busca por nombre
        tenant.ci.toLowerCase().includes(term) ||       // Busca por CI
        (tenant.phone && tenant.phone.includes(term))   // Busca por teléfono
    )
  })

  const handleEditClick = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setIsEditOpen(true)
  }
  
  const [tenantToCheckout, setTenantToCheckout] = useState<Tenant | null>(null)

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inquilinos</h2>
          <p className="text-muted-foreground">Gestiona los residentes registrados.</p>
        </div>
        <CreateTenantDialog onTenantCreated={fetchTenants} />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            {/* 3. CONECTAMOS EL INPUT AL ESTADO */}
            <Input 
                type="search" 
                placeholder="Buscar por nombre, CI o teléfono..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado General</CardTitle>
          <CardDescription>
            {/* Mostramos cuántos hay filtrados vs el total */}
            Mostrando {filteredTenants.length} de {tenants.length} inquilinos registrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
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
                {/* 4. USAMOS LA LISTA FILTRADA AQUÍ */}
                {filteredTenants.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <UserX className="h-8 w-8 text-muted-foreground/50" />
                                <p>
                                    {searchTerm 
                                        ? "No se encontraron resultados para tu búsqueda." 
                                        : "No hay inquilinos registrados."}
                                </p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.fullName}</TableCell>
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
                            <DropdownMenuItem onClick={() => setTenantToCheckout(tenant)}>
                              <LogOut className="mr-2 h-4 w-4 text-orange-600" /> 
                              Dar de Baja
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>    
      <EditTenantDialog 
        open={isEditOpen} 
        onOpenChange={(open) => {
            setIsEditOpen(open)
            if(!open) fetchTenants()
        }} 
        data={selectedTenant} 
      />
      <CheckoutTenantDialog 
        open={!!tenantToCheckout} 
        onOpenChange={(open) => {
            if (!open) {
                setTenantToCheckout(null)
                fetchTenants() 
            }
        }} 
        data={tenantToCheckout} 
      />
              
    </div>
  )
}
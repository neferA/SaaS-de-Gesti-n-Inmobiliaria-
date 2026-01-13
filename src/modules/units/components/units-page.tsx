import { Search, MoreHorizontal, Building, DoorOpen, FileEdit } from "lucide-react"
import { useState } from "react"
import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import { Badge } from "@/modules/core/components/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/modules/core/components/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/modules/core/components/dropdown-menu"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/modules/core/components/card"

import { CreateUnitDialog } from "./create-unit-dialog"
import { EditUnitDialog } from "./edit-unit-dialog"

// Mock Data ajustado a tu Modelo Prisma (Unit)
const units = [
  { id: "1", name: "Dpto 101", type: "DEPARTAMENTO", isOccupied: true, basePrice: 2500 },
  { id: "2", name: "Dpto 102", type: "DEPARTAMENTO", isOccupied: false, basePrice: 2500 },
  { id: "3", name: "Cuarto Azul", type: "CUARTO", isOccupied: true, basePrice: 800 },
  { id: "4", name: "Cuarto Rojo", type: "CUARTO", isOccupied: false, basePrice: 750 },
]

export const UnitsPage = () => {
  // 3. Estados para el Modal de Edición
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)

  // 4. Función para abrir el modal con los datos de la fila
  const handleEditClick = (unit: any) => {
    setSelectedUnit(unit)
    setIsEditOpen(true)
  }
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Unidades</h2>
          <p className="text-muted-foreground">Departamentos y Habitaciones.</p>
        </div>
        <CreateUnitDialog />
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar unidad..." className="pl-8" />
        </div>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario</CardTitle>
          <CardDescription>
            Lista de propiedades registradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Precio Base</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        {/* Icono dinámico */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            {unit.type === 'DEPARTAMENTO' ? <Building className="h-4 w-4" /> : <DoorOpen className="h-4 w-4" />}
                        </div>
                        {unit.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-sm text-muted-foreground">
                        {unit.type.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {/* Lógica basada en Boolean (isOccupied) */}
                    {unit.isOccupied ? (
                        <Badge variant="secondary">Ocupado</Badge>
                    ) : (
                        <Badge className="bg-green-600 hover:bg-green-700">Disponible</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Bs. {unit.basePrice}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(unit)}>
                            <FileEdit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <EditUnitDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        data={selectedUnit} 
      />
    </div>
  )
}
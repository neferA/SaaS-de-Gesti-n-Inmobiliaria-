import { useState, useEffect } from "react"
import { Search, Home, MoreHorizontal, PenSquare, Trash2, Loader2, Building, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

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
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/modules/core/components/alert-dialog"

// Servicios y Tipos
import { unitsService, type Unit } from "../services/units.service"

// Componentes de Diálogo
import { CreateUnitDialog } from "./create-unit-dialog"
import { EditUnitDialog } from "./edit-unit-dialog"

export const UnitsPage = () => {
  // 1. ESTADOS DE DATOS
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  // 2. ESTADOS PARA MODALES (Editar y Eliminar)
  const [unitToEdit, setUnitToEdit] = useState<Unit | null>(null)
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 3. ESTADO PARA BUSCADOR
  const [searchTerm, setSearchTerm] = useState("")

  // 4. CARGAR DATOS
  const fetchUnits = async () => {
    try {
      setLoading(true)
      const data = await unitsService.getAll()
      setUnits(data)
    } catch (error) {
      console.error("Error cargando unidades:", error)
      toast.error("Error al cargar inventario")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  // 5. LÓGICA DE FILTRADO (Nombre o Tipo)
  const filteredUnits = units.filter(unit => {
    const term = searchTerm.toLowerCase()
    return (
        unit.name.toLowerCase().includes(term) || // Buscar por nombre (ej: "Dpto 1")
        unit.type.toLowerCase().includes(term)    // Buscar por tipo (ej: "Cuarto")
    )
  })

  // 6. LÓGICA VISUAL
  const getStatusColor = (isOccupied: boolean) => {
    return isOccupied 
        ? "bg-blue-500 hover:bg-blue-600" 
        : "bg-green-500 hover:bg-green-600"; 
  }

  const getStatusText = (isOccupied: boolean) => {
    return isOccupied ? "OCUPADO" : "DISPONIBLE";
  }

  // 7. LÓGICA DE ELIMINACIÓN
  const confirmDelete = async () => {
    if (!unitToDelete) return
    setIsDeleting(true)
    try {
      await unitsService.delete(unitToDelete.id)
      toast.success("Unidad eliminada")
      fetchUnits()
    } catch (error: any) {
      toast.error("No se pudo eliminar", {
        description: error.response?.data?.message || "Error desconocido."
      })
    } finally {
      setIsDeleting(false)
      setUnitToDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Unidades</h2>
          <p className="text-muted-foreground">Gestiona tus cuartos y departamentos.</p>
        </div>
        <CreateUnitDialog onUnitCreated={fetchUnits} />
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search" 
                placeholder="Buscar unidad..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* TABLE CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario</CardTitle>
          <CardDescription>
             Mostrando {filteredUnits.length} de {units.length} unidades registradas.
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
                  <TableHead>Nombre / Nro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio Base</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Usamos filteredUnits en lugar de units */}
                {filteredUnits.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <Building className="h-8 w-8 text-muted-foreground/50" />
                                <p>
                                    {searchTerm 
                                        ? "No se encontraron resultados." 
                                        : "No hay unidades creadas aún."}
                                </p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            {unit.name}
                        </TableCell>
                        
                        <TableCell className="text-xs uppercase text-muted-foreground">
                            {unit.type}
                        </TableCell>
                        
                        <TableCell>
                            <Badge className={`${getStatusColor(unit.isOccupied)} text-white border-0`}>
                                {getStatusText(unit.isOccupied)}
                            </Badge>
                        </TableCell>
                        
                        <TableCell>
                           Bs {unit.basePrice}
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
                            
                            <DropdownMenuItem onClick={() => setUnitToEdit(unit)}>
                                <PenSquare className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => setUnitToDelete(unit)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
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

      {/* MODAL DE EDICIÓN */}
      <EditUnitDialog 
        open={!!unitToEdit} 
        onOpenChange={(open: boolean) => {
            if(!open) {
                setUnitToEdit(null)
                fetchUnits() // Refrescar al cerrar
            }
        }} 
        data={unitToEdit} 
      />

      {/* ALERT DIALOG DE ELIMINACIÓN */}
      <AlertDialog open={!!unitToDelete} onOpenChange={(open: boolean) => !open && setUnitToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                ¿Eliminar unidad?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vas a eliminar <strong>{unitToDelete?.name}</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
                onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    confirmDelete()
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting}
            >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sí, Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
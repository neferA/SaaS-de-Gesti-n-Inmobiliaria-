import { useState, useEffect } from "react"
import { Loader2, Plus, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/modules/core/components/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/modules/core/components/dialog"
import { Input } from "@/modules/core/components/input"
import { Label } from "@/modules/core/components/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/modules/core/components/select" // Asegúrate de tener este componente UI

// Servicios
import { tenantsService } from "../services/tenants.service"
import { unitsService, type  Unit } from "@/modules/units/services/units.service"

interface CreateTenantDialogProps {
  onTenantCreated?: () => void;
}

export const CreateTenantDialog = ({ onTenantCreated }: CreateTenantDialogProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Estado para guardar la lista de cuartos disponibles
  const [units, setUnits] = useState<Unit[]>([])

  const [formData, setFormData] = useState({
    fullName: "",
    ci: "",
    phone: "",
    unitId: "", 
    price: ""   
  })

  // Cargar unidades cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      const loadUnits = async () => {
        try {
          const data = await unitsService.getAll()
          // Opcional: Filtrar solo las disponibles si tu backend no lo hace
          // const available = data.filter(u => u.status === 'DISPONIBLE')
          setUnits(data)
        } catch (error) {
          console.error("Error cargando unidades", error)
          toast.error("No se pudieron cargar los cuartos")
        }
      }
      loadUnits()
    }
  }, [open])

  // Manejar cambio de cuarto: Auto-asigna el precio base
  const handleUnitChange = (unitId: string) => {
    const selectedUnit = units.find(u => u.id === unitId)
    setFormData(prev => ({
      ...prev,
      unitId: unitId,
      // Si encontramos el cuarto, ponemos su precio base automáticamente
      price: selectedUnit ? selectedUnit.basePrice.toString() : prev.price
    }))
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación manual simple antes de enviar
    if (!formData.unitId || !formData.price) {
        toast.error("Faltan datos", { description: "Debes seleccionar un cuarto y definir un precio." })
        return
    }

    setLoading(true)

    try {
      // PREPARAR DATOS PARA EL BACKEND
      // El backend exige price como NUMBER, el input nos da string. Convertimos aquí:
      const payload = {
          ...formData,
          price: Number(formData.price) // Conversión crucial
      }

      await tenantsService.create(payload)

      toast.success("Inquilino registrado y asignado", {
        description: `${formData.fullName} ahora ocupa el cuarto.`
      })

      setFormData({ fullName: "", ci: "", phone: "",  unitId: "", price: "" })
      setOpen(false)

      if (onTenantCreated) onTenantCreated()

    } catch (error: any) {
      console.error("Error creando inquilino:", error)
      toast.error("Error al registrar", {
        description: error.response?.data?.message || "Verifica los datos."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Inquilino
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Registrar y Asignar
          </DialogTitle>
          <DialogDescription>
            Crea el inquilino y asígnale un cuarto inmediatamente.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                id="fullName"
                placeholder="Juan Pérez"
                required
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="ci">Carnet (CI) *</Label>
                <Input
                id="ci"
                placeholder="1234567"
                required
                value={formData.ci}
                onChange={(e) => handleChange("ci", e.target.value)}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                id="phone"
                placeholder="777..."
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                />
            </div>
           
          </div>

          <div className="border-t my-2"></div>

          {/* SECCIÓN 2: ASIGNACIÓN DE CUARTO (OBLIGATORIO) */}
          <p className="text-sm font-medium text-muted-foreground">Datos del Alquiler</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Cuarto / Unidad *</Label>
                <Select onValueChange={handleUnitChange} value={formData.unitId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                        {units.length === 0 ? (
                          // Si no hay cuartos, mostramos mensaje
                          <div className="p-2 text-sm text-muted-foreground">
                            No hay cuartos creados
                          </div>
                        ) : (
                          // Si hay cuartos, los recorremos
                          units.map((unit) => (
                            <SelectItem 
                              key={unit.id} 
                              value={unit.id} 
                              disabled={unit.isOccupied} // Deshabilitamos si está ocupado
                            >
                              {/* Mostramos Nombre y Estado */}
                              {unit.name} ({unit.isOccupied ? "OCUPADO" : "DISPONIBLE"})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Precio Acordado *</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                        id="price"
                        type="number"
                        className="pl-7"
                        placeholder="0.00"
                        required
                        value={formData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                    />
                </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Inquilino
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
import { useState, useEffect } from "react"
import { Loader2, Save, UserCog } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/modules/core/components/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/modules/core/components/dialog"
import { Input } from "@/modules/core/components/input"
import { Label } from "@/modules/core/components/label"

// Importamos el servicio y el tipo
import { tenantsService, type Tenant } from "../services/tenants.service"

interface EditTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Tenant | null; // El inquilino que vamos a editar
}

export const EditTenantDialog = ({ open, onOpenChange, data }: EditTenantDialogProps) => {
  const [loading, setLoading] = useState(false)
  
  // Estado local del formulario
  const [formData, setFormData] = useState({
    fullName: "",
    ci: "",
    phone: "",
  })

  // EFECTO MÁGICO ✨: 
  // Cada vez que cambia 'data' (seleccionamos otro inquilino), rellenamos el formulario.
  useEffect(() => {
    if (data) {
      setFormData({
        fullName: data.fullName || "",
        ci: data.ci || "",
        phone: data.phone || ""    
      })
    }
  }, [data])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return

    setLoading(true)

    try {
      // Llamamos al servicio de actualización
      await tenantsService.update(data.id, formData)

      toast.success("Inquilino actualizado", {
        description: "Los cambios se han guardado correctamente."
      })

      onOpenChange(false) // Cerramos el modal

    } catch (error: any) {
      console.error("Error actualizando:", error)
      toast.error("Error al actualizar", {
        description: error.response?.data?.message || "No se pudieron guardar los cambios."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Editar Inquilino
          </DialogTitle>
          <DialogDescription>
            Modifica los datos personales de {data?.fullName}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nombre Completo</Label>
            <Input
              id="edit-name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-ci">Cédula de Identidad (CI)</Label>
            <Input
              id="edit-ci"
              value={formData.ci}
              onChange={(e) => handleChange("ci", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
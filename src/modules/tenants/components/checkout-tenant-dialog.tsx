import { useState } from "react"
import { Loader2, LogOut, FileText } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/modules/core/components/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/modules/core/components/dialog"
import { Label } from "@/modules/core/components/label"
import { tenantsService, type Tenant } from "../services/tenants.service"

// Si no tienes un componente Textarea, usa este estilo básico o importa el de Shadcn
const Textarea = (props: any) => (
  <textarea 
    {...props} 
    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
)

interface CheckoutTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Tenant | null;
}

export const CheckoutTenantDialog = ({ open, onOpenChange, data }: CheckoutTenantDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return

    setLoading(true)

    try {
      // Llamamos al endpoint especial
      await tenantsService.checkout(data.id, { notes })

      toast.success("Baja procesada exitosamente", {
        description: `El cuarto ha sido liberado y ${data.fullName} ha salido.`
      })
      
      setNotes("") // Limpiar notas
      onOpenChange(false) // Cerrar modal y refrescar (lo maneja el padre)

    } catch (error: any) {
      console.error("Error en checkout:", error)
      toast.error("No se pudo procesar la baja", {
        description: error.response?.data?.message || "Error interno del servidor."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <LogOut className="h-5 w-5" />
            Finalizar Contrato / Dar de Baja
          </DialogTitle>
          <DialogDescription>
            Estás a punto de registrar la salida de <strong>{data?.fullName}</strong>. 
            Esto liberará el cuarto automáticamente.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Notas de salida (Opcional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Ej: Devolvió las llaves, cuarto en buen estado..."
              value={notes}
              onChange={(e: any) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
            </Button>
            <Button 
                type="submit" 
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Salida
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
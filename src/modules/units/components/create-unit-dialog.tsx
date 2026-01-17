import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Building, Plus } from "lucide-react"
import { toast } from "sonner" 
import { Button } from "@/modules/core/components/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/modules/core/components/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/modules/core/components/form"
import { Input } from "@/modules/core/components/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/modules/core/components/select"
import { unitsService } from "../services/units.service"

const formSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto (min 2 letras)"),
  type: z.enum(["DEPARTAMENTO", "CUARTO"]), 
  basePrice: z.coerce.number().min(1, "El precio debe ser mayor a 0"),
})

// Definimos los props para refrescar la tabla padre
interface CreateUnitDialogProps {
  onUnitCreated?: () => void;
}

export const CreateUnitDialog = ({ onUnitCreated }: CreateUnitDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "DEPARTAMENTO",
      basePrice: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        // 2. LLAMADA AL BACKEND
        await unitsService.create(values)

        toast.success("Unidad creada exitosamente")
        
        // Limpieza
        form.reset()
        setOpen(false)
        
        // 3. ACTUALIZAR TABLA PADRE
        if (onUnitCreated) onUnitCreated()

    } catch (error: any) {
        console.error(error)
        toast.error("Error al crear", {
            description: error.response?.data?.message || "Verifica los datos."
        })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> Nueva Unidad
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Registrar Unidad
          </DialogTitle>
          <DialogDescription>Añade un departamento o habitación al inventario.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Nombre */}
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre / N°</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Dpto 101" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                 {/* Tipo (Enum Exacto) */}
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="DEPARTAMENTO">Departamento</SelectItem>
                        <SelectItem value="CUARTO">Cuarto</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Precio Base */}
                <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Precio Base (Bs)</FormLabel>
                    <FormControl>
                        <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field}                           
                            value={field.value as number} 
                            onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Unidad
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
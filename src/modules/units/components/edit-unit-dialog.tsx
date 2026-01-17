import { useEffect} from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, PenSquare } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/modules/core/components/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/modules/core/components/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/modules/core/components/form"
import { Input } from "@/modules/core/components/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/modules/core/components/select"

import { unitsService, type Unit } from "../services/units.service"

// Schema idéntico al de creación
const formSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  type: z.enum(["DEPARTAMENTO", "CUARTO"]),
  basePrice: z.coerce.number().min(1),
})

interface EditUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Unit | null; // La unidad que vamos a editar
}

export const EditUnitDialog = ({ open, onOpenChange, data }: EditUnitDialogProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "DEPARTAMENTO",
      basePrice: 0,
    },
  })

  // EFECTO: Cuando 'data' cambia (se abre el modal), rellenamos el form
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        type: data.type,
        basePrice: data.basePrice,
      })
    }
  }, [data, form])

  async function onSubmit(values: any) {
    if (!data) return

    try {
      // Llamamos al servicio update
      await unitsService.update(data.id, values)

      toast.success("Unidad actualizada")
      onOpenChange(false) // Cerramos (el padre refrescará)

    } catch (error: any) {
      toast.error("Error al actualizar", {
        description: error.response?.data?.message
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenSquare className="h-5 w-5" />
            Editar Unidad
          </DialogTitle>
          <DialogDescription>
            Modifica los detalles de {data?.name}.
          </DialogDescription>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
               {/* Tipo */}
               <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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

              {/* Precio */}
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (Bs)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
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
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2} from "lucide-react"

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

const formSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["DEPARTAMENTO", "CUARTO"]),
  basePrice: z.coerce.number().min(1),
  isOccupied: z.string(),
})

interface EditUnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any
}

export const EditUnitDialog = ({ open, onOpenChange, data }: EditUnitDialogProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "DEPARTAMENTO",
      basePrice: 0,
      isOccupied: "false",
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        type: data.type,
        basePrice: data.basePrice,
        isOccupied: data.isOccupied ? "true" : "false", // Convertir bool a string para el select
      })
    }
  }, [data, form])

  function onSubmit(values: any) {
    const payload = { ...values, isOccupied: values.isOccupied === "true" }
    console.log("Editando Unidad ID:", data.id, payload)
    setTimeout(() => onOpenChange(false), 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Editar Unidad</DialogTitle>
          <DialogDescription>Modificar detalles de la propiedad.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
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
                        onChange={e => field.onChange(e.target.value)} 
                    />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="DEPARTAMENTO">Departamento</SelectItem>
                      <SelectItem value="CUARTO">Cuarto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOccupied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="false">🟢 Disponible</SelectItem>
                      <SelectItem value="true">🔵 Ocupado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Actualizar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
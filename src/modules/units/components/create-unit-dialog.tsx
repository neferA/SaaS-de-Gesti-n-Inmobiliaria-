import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Building } from "lucide-react"

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

// 1. SCHEMA AJUSTADO A PRISMA (Modelo Unit)
const formSchema = z.object({
  name: z.string().min(2, "Ej: Dpto 101"),
  type: z.enum(["DEPARTAMENTO", "CUARTO"]), // Coincide con tu Enum UnitType exacto
  basePrice: z.coerce.number().min(1),       // BD: basePrice (Decimal)
  isOccupied: z.string(),                    // BD: isOccupied (Boolean) - Lo manejamos como string en el select y convertimos luego
})

export const CreateUnitDialog = () => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "DEPARTAMENTO",
      basePrice: 0,
      isOccupied: "false", // "false" string para el select
    },
  })

  function onSubmit(values: any) {
    // Conversión final antes de enviar al backend
    const payload = {
        ...values,
        isOccupied: values.isOccupied === "true" // Convertimos string a boolean real
    }
    console.log("Datos exactos para Prisma Unit:", payload)
    
    setTimeout(() => {
        setOpen(false)
        form.reset()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
          <Building className="h-4 w-4" /> Nueva Unidad
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Registrar Unidad</DialogTitle>
          <DialogDescription>Añade un departamento o habitación al inventario.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
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
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            {/* Tipo (Enum Exacto) */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Propiedad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DEPARTAMENTO">Departamento</SelectItem>
                      <SelectItem value="CUARTO">Cuarto / Habitación</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado (Boolean) */}
            <FormField
              control={form.control}
              name="isOccupied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Inicial</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="false">🟢 Disponible (Vacío)</SelectItem>
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
                Guardar Unidad
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
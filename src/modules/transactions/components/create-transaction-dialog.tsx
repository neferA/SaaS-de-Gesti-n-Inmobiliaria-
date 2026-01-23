import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, DollarSign } from "lucide-react"
import { format } from "date-fns" 
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

import { transactionsService } from "../services/transactions.service"

const formSchema = z.object({
  type: z.enum(["INGRESO", "GASTO"]),
  amount: z.coerce.number().min(1, "El monto es obligatorio"),
  category: z.string().min(1, "La categoría es requerida"), // 👈 Ahora es requerida siempre
  description: z.string().min(3, "La descripción es requerida"),
  date: z.string().optional(),
})

interface CreateTransactionDialogProps {
  onTransactionCreated?: () => void;
}

export const CreateTransactionDialog = ({ onTransactionCreated }: CreateTransactionDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "INGRESO",
      amount: 0,
      category: "ALQUILER_MENSUAL", // Valor inicial correcto
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  })

  // 1. Observamos el cambio de tipo
  const typeValue = form.watch("type")

  // 2. EFECTO AUTOMÁTICO: Cambiar categoría por defecto según el tipo
  useEffect(() => {
    if (typeValue === "INGRESO") {
        form.setValue("category", "ALQUILER_MENSUAL")
    } else {
        form.setValue("category", "OTROS") // O la categoría por defecto de gastos que prefieras
    }
  }, [typeValue, form])

  async function onSubmit(values: any) {
    try {
      const payload = { ...values }
      
      // ⚠️ IMPORTANTE: Eliminamos el 'if' que borraba la categoría.
      // Ahora SIEMPRE enviamos 'ALQUILER_MENSUAL' u otra categoría.

      console.log("Enviando al Backend:", payload) 

      await transactionsService.create(payload)

      toast.success("Transacción registrada")
      form.reset()
      setOpen(false)
      
      if (onTransactionCreated) onTransactionCreated()

    } catch (error: any) {
      console.error(error)
      toast.error("Error al registrar", {
        description: error.response?.data?.message || "Verifica los datos."
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <DollarSign className="mr-2 h-4 w-4" /> Registrar Movimiento
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Nuevo Movimiento</DialogTitle>
          <DialogDescription>
            Registra ingresos o gastos contables.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* TIPO */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INGRESO">🟢 INGRESO</SelectItem>
                      <SelectItem value="GASTO">🔴 GASTO</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                {/* MONTO */}
                <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Monto (Bs)</FormLabel>
                    <FormControl>
                        <Input 
                            type="number" 
                            className="text-lg font-bold" 
                            {...field}
                            value={(field.value as number) || ''} 
                            onChange={(e) => field.onChange(e.target.value)}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* FECHA */}
                <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            {/* CATEGORÍA ( visible para AMBOS, pero con opciones diferentes) */}
            <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {typeValue === "INGRESO" ? (
                            // 🟢 OPCIONES PARA INGRESO
                            <>
                                <SelectItem value="ALQUILER_MENSUAL">Alquiler Mensual</SelectItem>
                                <SelectItem value="GARANTIA">Garantía / Depósito</SelectItem>
                                <SelectItem value="OTROS_INGRESOS">Otros Ingresos</SelectItem>
                            </>
                        ) : (
                            // 🔴 OPCIONES PARA GASTO
                            <>
                                <SelectItem value="AGUA_MEDIDOR_1">Agua (Medidor 1)</SelectItem>
                                <SelectItem value="AGUA_MEDIDOR_2">Agua (Medidor 2)</SelectItem>
                                <SelectItem value="LUZ_GENERAL">Luz General</SelectItem>
                                <SelectItem value="INTERNET">Internet</SelectItem>
                                <SelectItem value="MANTENIMIENTO_GENERAL">Mantenimiento</SelectItem>
                                <SelectItem value="OTROS">Otros Gastos</SelectItem>
                            </>
                        )}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {/* DESCRIPCIÓN */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <textarea 
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder={typeValue === "INGRESO" ? "Ej: Cobro alquiler Enero Dpto 1" : "Ej: Pago factura de luz"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Transacción
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
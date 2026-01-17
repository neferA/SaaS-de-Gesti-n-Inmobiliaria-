import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, DollarSign } from "lucide-react"
import { format } from "date-fns" // Asegúrate de tener: npm install date-fns
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

// 1. SCHEMA ACTUALIZADO: Usamos los valores EN ESPAÑOL que espera tu Backend
const formSchema = z.object({
  type: z.enum(["INGRESO", "GASTO"]), // 👈 CAMBIO CLAVE: Español
  amount: z.coerce.number().min(1, "El monto es obligatorio"),
  category: z.string().optional(),
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
      type: "INGRESO",        // Valor por defecto en español
      amount: 0,
      category: "ALQUILER_MENSUAL",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"), // Fecha de hoy
    },
  })

  // Observamos el tipo para cambiar la UI dinámicamente
  const typeValue = form.watch("type")

  async function onSubmit(values: any) {
    try {
      // Preparamos el payload EXACTAMENTE como en tu Yaak
      const payload = { ...values }
      
      // Lógica de limpieza: Si es INGRESO, generalmente no enviamos categoría de gasto
      // (A menos que tu backend lo permita, pero por limpieza lo quitamos)
      if (payload.type === "INGRESO") {
          delete payload.category
      }

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
            
            {/* TIPO: INGRESO o GASTO */}
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
                            value={field.value as number}   
                            onChange={field.onChange}
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

            {/* CATEGORÍA (Solo visible si es GASTO, o siempre visible según prefieras) */}
            {typeValue === "GASTO" && (
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {/* 👇 Las mismas categorías de tu DTO/Yaak */}
                        <SelectItem value="ALQUILER_MENSUAL">Alquiler Mensual</SelectItem>
                        <SelectItem value="AGUA_MEDIDOR_1">Agua (Medidor 1)</SelectItem>
                        <SelectItem value="LUZ_GENERAL">Luz General</SelectItem>
                        <SelectItem value="MANTENIMIENTO">Mantenimiento</SelectItem>
                        <SelectItem value="OTROS">Otros</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}

            {/* DESCRIPCIÓN */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <textarea 
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Ej: Pago de agua del mes de Enero"
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
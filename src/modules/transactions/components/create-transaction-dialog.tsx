import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Loader2 } from "lucide-react"

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

const formSchema = z.object({
  tenantId: z.string().min(1, "Selecciona un inquilino"),
  amount: z.coerce.number().min(1, "El monto debe ser mayor a 0"),
  type: z.enum(["Alquiler", "Expensas", "Garantia", "Otro"]),
  method: z.enum(["QR", "Efectivo", "Transferencia"]),
  description: z.string().optional(),
})

export const CreateTransactionDialog = () => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      type: "Alquiler",
      method: "QR",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Nuevo Pago:", values)
    setTimeout(() => {
        setOpen(false)
        form.reset()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* CORRECCIÓN AQUÍ: Quitamos <Button> y aplicamos las clases al Trigger */}
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
          <PlusCircle className="h-4 w-4" /> Registrar Pago
      </DialogTrigger>

        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
          <DialogTitle>Nuevo Pago</DialogTitle>
          <DialogDescription>Registra un ingreso financiero.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Selección de Inquilino */}
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inquilino</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="¿Quién paga?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Juan Pérez (Dpto 101)</SelectItem>
                      <SelectItem value="2">Maria Gomez (Dpto 102)</SelectItem>
                      <SelectItem value="3">Carlos Ruiz (Hab 3)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                {/* Monto */}
                <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Monto (Bs)</FormLabel>
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

                {/* Método de Pago */}
                <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Método</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="QR">QR Simple</SelectItem>
                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                        <SelectItem value="Transferencia">Transferencia</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            {/* Concepto */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concepto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Alquiler">Alquiler Mensual</SelectItem>
                      <SelectItem value="Expensas">Expensas / Luz / Agua</SelectItem>
                      <SelectItem value="Garantia">Garantía</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Ingreso
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Loader2, CreditCard, Phone, User } from "lucide-react" // Agregué icono CreditCard para CI

import { Button } from "@/modules/core/components/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/modules/core/components/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/modules/core/components/form"
import { Input } from "@/modules/core/components/input"

// 1. SCHEMA AJUSTADO A PRISMA (Modelo Tenant)
const formSchema = z.object({
  fullName: z.string().min(3, "Nombre completo requerido"), // BD: fullName
  ci: z.string().min(5, "El CI es obligatorio"),            // BD: ci (Unique)
  phone: z.string().optional(),                             // BD: phone (Opcional)
  // Eliminamos 'email' y 'unit' porque el tenant se crea primero, luego se asigna contrato
})

export const CreateTenantDialog = () => {
  const [open, setOpen] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      ci: "",
      phone: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Datos exactos para Prisma Tenant:", values)
    setTimeout(() => {
      setOpen(false)
      form.reset()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
          <Plus className="h-4 w-4" /> Nuevo Inquilino
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Registrar Inquilino</DialogTitle>
          <DialogDescription>
            Datos personales del residente (Tal cual su documento).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Nombre Completo */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Ej: Juan Pérez" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                {/* CI (Nuevo Campo Obligatorio) */}
                <FormField
                control={form.control}
                name="ci"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cédula (CI)</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="123456 SC" className="pl-9" {...field} />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Teléfono */}
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Teléfono / Celular</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="70012345" className="pl-9" {...field} />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Guardar Inquilino
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
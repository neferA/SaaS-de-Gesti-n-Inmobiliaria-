import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { UserPlus, Loader2, Lock, Mail, } from "lucide-react"

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

// 1. AJUSTE DE SCHEMA: Ahora coincide con tu modelo Prisma
const formSchema = z.object({
  firstName: z.string().min(2, "Nombre requerido"), // Coincide con Prisma
  lastName: z.string().min(2, "Apellido requerido"), // Coincide con Prisma
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  roleName: z.enum(["admin", "staff", "viewer"]), // Usamos roleName temporalmente
})

export const CreateUserDialog = () => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleName: "staff",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Así se verán los datos listos para tu Backend
    console.log("Datos para Prisma:", values)
    setTimeout(() => {
        setOpen(false)
        form.reset()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
          <UserPlus className="h-4 w-4" /> Crear Usuario
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
          <DialogDescription>Crea una cuenta de acceso compatible con Prisma.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* 2. AJUSTE VISUAL: Dos columnas para Nombres y Apellidos */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre(s)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Apellido(s)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="juan@sistema.com" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="password" className="pl-9" placeholder="******" {...field} />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {/* Rol */}
            <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rol Asignado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {/* Estos valores deberán coincidir con los que crearemos en la DB */}
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="staff">Personal</SelectItem>
                        <SelectItem value="viewer">Observador</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar en BD
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
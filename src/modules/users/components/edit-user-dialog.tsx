import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
// 👇 CORRECCIÓN: Renombramos 'User' a 'UserIcon' para evitar conflicto con la interfaz
import { Loader2, Save, User as UserIcon, Mail, Lock } from "lucide-react"
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

// Ahora 'User' se refiere solo a la interfaz del servicio, sin conflictos.
import { usersService, type User } from "../services/users.service"

const formSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 letras"),
  lastName: z.string().min(2, "Mínimo 2 letras"),
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().optional(),
  roleId: z.string().min(1, "Rol requerido"),
})

interface EditUserDialogProps {
  user: User | null 
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: () => void
}

export const EditUserDialog = ({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "", lastName: "", username: "", email: "", password: "", roleId: "2"
    },
  })

  useEffect(() => {
    if (user && open) {
      let roleId = "2"
      const roleName = user.role?.name?.toLowerCase() || ""
      
      if (roleName.includes("admin")) roleId = "1"
      else if (roleName.includes("observador")) roleId = "3"
      
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: "",
        roleId: roleId, 
      })
    }
  }, [user, open, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return

    try {
      const payload: any = {
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        roleId: Number(values.roleId),
      }

      if (values.password && values.password.length > 0) {
        if (values.password.length < 6) {
             form.setError("password", { message: "Mínimo 6 caracteres si vas a cambiarla" })
             return
        }
        payload.password = values.password
      }

      await usersService.update(user.id, payload)

      toast.success("Usuario actualizado")
      onOpenChange(false)
      onUserUpdated()

    } catch (error: any) {
      console.error(error)
      toast.error("Error al actualizar", { description: error.response?.data?.message })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>Modifica los datos de acceso.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {/* Username */}
             <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <div className="relative">
                        {/* 👇 Usamos UserIcon aquí */}
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña (Opcional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="password" className="pl-9" placeholder="Dejar vacío para no cambiar" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">🛡️ Administrador</SelectItem>
                      <SelectItem value="2">👤 Personal</SelectItem>
                      <SelectItem value="3">👀 Observador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
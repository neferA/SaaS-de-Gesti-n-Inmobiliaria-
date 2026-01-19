import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Save, User as UserIcon, Mail, Lock } from "lucide-react"

import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/modules/core/components/card"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/modules/core/components/form"

// Usamos el authService que ya tiene el método 'update' genérico
import { authService } from "../services/auth.service"
import { useAuth } from "../hooks/use-auth"

// Esquema unificado (Igual que el tuyo, pero sin roleId obligatorio)
const formSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 letras"),
  lastName: z.string().min(2, "Mínimo 2 letras"),
  username: z.string().min(3, "Mínimo 3 caracteres").optional(), // Opcional por si tu backend no lo usa
  email: z.string().email("Correo inválido"),
  password: z.string().optional(), // Opcional: si está vacío no se cambia
})

export const ProfilePage = () => {
  const { user } = useAuth() // Obtenemos el usuario logueado
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "", lastName: "", username: "", email: "", password: ""
    },
  })

 useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "", 
        email: user.email || "",
        password: "", 
      })
    }
  
  }, [form, user?.id, user?.firstName, user?.lastName, user?.email, user?.username])

  // 2. Enviar cambios
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.id) return

    try {
      setLoading(true)

      // Preparamos el payload
      const payload: any = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        username: values.username,
      }

      // Solo agregamos password si el usuario escribió algo
      if (values.password && values.password.length > 0) {
        if (values.password.length < 6) {
             form.setError("password", { message: "Mínimo 6 caracteres" })
             setLoading(false)
             return
        }
        payload.password = values.password
      }

      // Llamamos al update genérico del authService
      await authService.update(user.id, payload)

      toast.success("Perfil actualizado correctamente")
      
      // Actualizamos el LocalStorage para reflejar los cambios en el Header al instante
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...payload }))
      
      // Opcional: Recargar la página si quieres asegurar refresco total
      // window.location.reload()

    } catch (error: any) {
      console.error(error)
      const msg = error.response?.data?.message || "Error al actualizar perfil"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }
//console.log("Datos del usuario:", user);
  return (
    <div className="max-w-2xl mx-auto py-6 animate-in fade-in duration-500">
        
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>Mi Perfil</CardTitle>
                <CardDescription>Actualiza tus datos personales y contraseña.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
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
                    <FormLabel>Correo Electrónico</FormLabel>
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

              <div className="pt-4">
                  <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Seguridad</span></div>
                  </div>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva Contraseña (Opcional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="password" className="pl-9" placeholder="Dejar vacío para mantener la actual" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
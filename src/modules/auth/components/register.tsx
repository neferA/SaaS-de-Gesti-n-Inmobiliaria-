import { useState } from "react"
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner" // Usamos sonner para notificaciones bonitas

import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import { Label } from "@/modules/core/components/label"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/modules/core/components/card"

import { authService } from "../services/auth.service"

export const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Enviar datos al backend
      await authService.register(formData)
      
      // 2. Notificar éxito
      toast.success("Cuenta creada exitosamente", {
        description: "Ahora puedes iniciar sesión con tus credenciales."
      })

      // 3. Redirigir al Login
      navigate("/auth/login")

    } catch (err: any) {
      console.error("Error en registro:", err)
      
      // Manejo básico de errores del backend
      if (err.response) {
        const messages = Array.isArray(err.response.data.message) 
            ? err.response.data.message.join(", ") 
            : err.response.data.message;
         // Si el backend dice "Email already exists" o similar
        toast.error("No se pudo registrar", {
            description: messages || "Verifica los datos ingresados."
         })
      } else {
         toast.error("Error de conexión", {
            description: "No se pudo contactar con el servidor."
         })
      }
    } finally {
      setLoading(false)
    }
  }

  // Helper para actualizar el estado del formulario
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md border-muted-foreground/20 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
            </div>
        </div>
        <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
        <CardDescription>
          Ingresa tus datos para registrarte en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombres y Apellidos en dos columnas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input 
                    id="firstName" 
                    placeholder="Juan" 
                    required 
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input 
                    id="lastName" 
                    placeholder="Pérez" 
                    required 
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="juan@empresa.com"
                className="pl-9"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-9 pr-9"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/auth/login" className="text-primary hover:underline font-medium">
            Inicia Sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
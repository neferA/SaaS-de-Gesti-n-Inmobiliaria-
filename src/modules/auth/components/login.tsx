import { useState } from "react"
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle } from "lucide-react" // Agregué AlertCircle
import { Link, useNavigate } from "react-router" 

import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import { Label } from "@/modules/core/components/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/core/components/card"

// 1. IMPORTAMOS EL SERVICIO DE AUTENTICACIÓN
import { authService } from "../services/auth.service"

export const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // 2. ESTADO PARA MANEJAR ERRORES DE LOGIN
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Llamada limpia al servicio
      const response = await authService.login(formData)

      // Buscamos el token (Soporte para accessToken o access_token)
      const token = response.accessToken || response.access_token

      if (token) {
        localStorage.setItem("token", token)
        
        if (response.user) {
           localStorage.setItem("user", JSON.stringify(response.user))
        }
        
        navigate("/dashboard")
      } else {
        // Error de lógica: El servidor respondió bien pero sin token
        setError("Error de comunicación: Credenciales aceptadas pero sin acceso.")
      }

    } catch (err: any) {
      // Mantenemos console.error para que TÚ puedas depurar si falla, 
      // pero el usuario solo ve el mensaje de UI
      console.error("Login fallido:", err)

      if (err.response && err.response.status === 401) {
        setError("Correo o contraseña incorrectos.")
      } else {
        setError("No se pudo conectar con el servidor.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-muted-foreground/20 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
            </div>
        </div>
        <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* MOSTRAR MENSAJE DE ERROR SI EXISTE */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* CAMPO EMAIL */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@empresa.com"
                className="pl-9"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* CAMPO PASSWORD */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link 
                to="#" 
                className="text-sm font-medium text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-9 pr-9"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 justify-center">
       <p className="text-sm text-muted-foreground">
         ¿No tienes cuenta?{" "}
         <Link to="/auth/register" className="text-primary hover:underline font-medium">
           Regístrate aquí
         </Link>
       </p>
     </CardFooter>
    </Card>
  )
}
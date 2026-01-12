import { useState } from "react"
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
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
// import { useAuthStore } from "../hooks/useAuthStore" // Descomentar cuando tengamos el store listo

export const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Estados temporales para el formulario
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // SIMULACIÓN DE LOGIN (Aquí conectaremos Axios luego)
    console.log("Datos enviados:", formData)
    
    setTimeout(() => {
      setLoading(false)
      // Redirigir al dashboard tras "login exitoso"
      navigate("/dashboard")
    }, 2000)
  }

  return (
    <Card className="w-full max-w-md border-muted-foreground/20 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
            {/* Aquí podrías poner tu Logo */}
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
                Verificando...
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
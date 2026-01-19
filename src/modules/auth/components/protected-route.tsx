import { Navigate, Outlet, useLocation } from "react-router"

export const ProtectedRoute = () => {
  const location = useLocation()
  
  // Verificamos si existe el token
  const isAuthenticated = !!localStorage.getItem("token")

  if (!isAuthenticated) {
    // Si no hay token, redirigir al Login
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Si hay token, dejar pasar
  return <Outlet />
}
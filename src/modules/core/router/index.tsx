import {createBrowserRouter, Navigate} from "react-router";
import { AuthLayout } from "../layouts/auth-layout";
import { AdminLayout } from "../layouts/admin-layout";

import { Login } from "@/modules/auth/components/login";
import { Register } from "@/modules/auth/components/register";
import { ProtectedRoute } from "@/modules/auth/components/protected-route";

import { DashboardPage } from "@/modules/dashboard/components/dashboard-page";
import { TenantsPage } from "@/modules/tenants/components/tenants-page";
import { TransactionsPage } from "@/modules/transactions/components/transactions-page";
import { UsersPage } from "@/modules/users/components/users-page";
import { UnitsPage } from "@/modules/units/components/units-page";
import { HistoryPage } from "@/modules/history/components/history-page";
import { ProfilePage } from "@/modules/auth/components/profile-page";

export const router = createBrowserRouter([
  // 1. Redirección Raíz: Si entran a "/", los mandamos al login
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // 2. Rutas Públicas (Login, Recuperar contraseña)
  // Usan el AuthLayout (diseño centrado, limpio)
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
        {
        path: "login",
        element: <Login />, // Ahora sí encontrará el componente
        },
        {
            path: "register", // Nueva ruta
            element: <Register />,
        },
    ],
  },

  // 3. Rutas Privadas (El Sistema Principal)
  // Usan el AdminLayout (Sidebar, Header, Menús)
  
  {
    element: <ProtectedRoute />, 
    children: [
      {
        path: "/dashboard",
        element: <AdminLayout />, 
        children: [
          {
            index: true, 
            element: <DashboardPage />,
          },
          {
            path: "profile", 
            element: <ProfilePage />,
          },
          {
            path: "tenants",
            element: <TenantsPage />,
          },
          {
            path: "transactions",
            element: <TransactionsPage />,
          },
          {
            path: "units",
            element: <UnitsPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "history",
            element: <HistoryPage />,
          },
        ],
      },
    ],
  },
  
  // 4. Ruta 404 (Opcional pero recomendada)
  {
    path: "*",
    element: <div className="h-screen flex items-center justify-center font-bold text-xl">404 - Página no encontrada</div>,
  }
]);
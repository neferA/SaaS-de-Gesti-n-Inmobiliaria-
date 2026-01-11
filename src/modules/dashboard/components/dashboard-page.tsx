import { 
  Users, 
  CreditCard, 
  Home, 
  AlertCircle,
  TrendingUp 
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/core/components/card" // 👈 Ajusta si tu card está en otro lado

export const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. TÍTULO DE LA SECCIÓN */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Panel General</h2>
        <p className="text-muted-foreground">Resumen de actividad del mes actual</p>
      </div>

      {/* 2. TARJETAS DE MÉTRICAS (KPIs) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Tarjeta 1: Ingresos Totales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
            <p className="text-xs text-muted-foreground">
              +20.1% respecto al mes pasado
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta 2: Inquilinos Activos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquilinos Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15</div>
            <p className="text-xs text-muted-foreground">
              2 contratos vencen este mes
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta 3: Ocupación */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              11/12 Unidades ocupadas
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta 4: Pagos Pendientes (Deudas) */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Pendiente de Pago</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">$2,300.00</div>
            <p className="text-xs text-red-600/80">
              3 inquilinos en mora
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. SECCIÓN DE ACTIVIDAD RECIENTE (Ejemplo visual) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Gráfico o Resumen Grande (Ocupa 4 columnas) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
            <CardDescription>
              Comportamiento de ingresos en los últimos 6 meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-50 flex items-center justify-center text-muted-foreground bg-slate-100 rounded-md">
                <TrendingUp className="mr-2 h-6 w-6" />
                (Aquí pondremos un gráfico luego)
             </div>
          </CardContent>
        </Card>

        {/* Lista de Últimos Pagos (Ocupa 3 columnas) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pagos Recientes</CardTitle>
            <CardDescription>
              Últimas 5 transacciones registradas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Item de lista simulado 1 */}
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Juan Pérez (Dpto 4)</p>
                  <p className="text-xs text-muted-foreground">Alquiler Enero</p>
                </div>
                <div className="ml-auto font-medium">+$1,500</div>
              </div>
              
              {/* Item de lista simulado 2 */}
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Maria Gomez (Dpto 2)</p>
                  <p className="text-xs text-muted-foreground">Expensas</p>
                </div>
                <div className="ml-auto font-medium">+$300</div>
              </div>
              
               {/* Item de lista simulado 3 */}
               <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Carlos Ruiz (Dpto 1)</p>
                  <p className="text-xs text-muted-foreground">Alquiler Enero</p>
                </div>
                <div className="ml-auto font-medium">+$1,500</div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
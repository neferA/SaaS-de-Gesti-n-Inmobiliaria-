import { useEffect, useState } from "react"
import { 
  Users, Home, Wallet, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Loader2, Building 
} from "lucide-react"
import { toast } from "sonner"
import { Link } from "react-router" // Asumiendo que usas react-router

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/modules/core/components/card"
import { Button } from "@/modules/core/components/button"
import { Progress } from "@/modules/core/components/progress" // Necesitarás este componente UI

// Importamos los servicios que ya creamos
import { unitsService} from "@/modules/units/services/units.service"
import { tenantsService} from "@/modules/tenants/services/tenants.service"
import { transactionsService, type DashboardResponse } from "@/modules/transactions/services/transactions.service"

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  
  // Estados para almacenar la data
  const [stats, setStats] = useState({
    totalUnits: 0,
    occupiedUnits: 0,
    occupancyRate: 0,
    totalTenants: 0,
  })
  
  const [financials, setFinancials] = useState<DashboardResponse['summary']>({
    income: 0,
    expense: 0,
    netProfit: 0
  })

  // Carga inicial
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        
        // Obtenemos fecha actual para el reporte financiero
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        // 🚀 LLAMADAS EN PARALELO (Promise.all para velocidad)
        const [unitsData, tenantsData, financeData] = await Promise.all([
          unitsService.getAll(),
          tenantsService.getAll(),
          transactionsService.getReport(month, year)
        ])

        // 1. Calcular Estadísticas de Ocupación
        const totalUnits = unitsData.length
        // Ajusta la lógica según si usas isOccupied o status
        const occupiedUnits = unitsData.filter((u: any) => u.isOccupied === true).length 
        const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0

        setStats({
          totalUnits,
          occupiedUnits,
          occupancyRate,
          totalTenants: tenantsData.length
        })

        // 2. Guardar Datos Financieros
        setFinancials(financeData.summary)

      } catch (error) {
        console.error("Error cargando dashboard:", error)
        toast.error("No se pudo cargar el resumen.")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* HEADER DE BIENVENIDA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel Principal</h2>
          <p className="text-muted-foreground">Bienvenido de nuevo. Aquí tienes el resumen de hoy.</p>
        </div>
        <div className="flex gap-2">
            {/* Accesos rápidos */}
            <Link to="/dashboard/tenants">
                <Button variant="outline">Gestión Inquilinos</Button>
            </Link>
            <Link to="/dashboard/transactions">
                <Button>Registrar Pago</Button>
            </Link>
        </div>
      </div>

      {/* 1. SECCIÓN DE KPI (Indicadores Clave) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* INGRESO DEL MES */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos (Mes Actual)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(financials.income)}</div>
            <p className="text-xs text-muted-foreground">
              Calculado automáticamente
            </p>
          </CardContent>
        </Card>

        {/* OCUPACIÓN */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
            <Home className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.occupancyRate)}%</div>
            <Progress value={stats.occupancyRate} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.occupiedUnits} de {stats.totalUnits} unidades ocupadas
            </p>
          </CardContent>
        </Card>

        {/* INQUILINOS ACTIVOS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquilinos Activos</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              Registrados en el sistema
            </p>
          </CardContent>
        </Card>

        {/* BALANCE NETO */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
            <Wallet className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${financials.netProfit >= 0 ? 'text-primary' : 'text-red-500'}`}>
                {formatMoney(financials.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresos - Gastos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. SECCIÓN DE ACCESO VISUAL RÁPIDO */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* BANNER DE ACCIÓN (Ocupa 4 columnas) */}
        <Card className="col-span-4 bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Estado de la Propiedad
                </CardTitle>
                <CardDescription>
                    Tienes {stats.totalUnits - stats.occupiedUnits} unidades disponibles para alquilar en este momento.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link to="/dashboard/units">
                    <Button variant="secondary" className="w-full sm:w-auto">
                        Ver Inventario de Unidades
                    </Button>
                </Link>
            </CardContent>
        </Card>

        {/* RESUMEN DE FLUJO (Ocupa 3 columnas) */}
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Flujo de Caja</CardTitle>
                <CardDescription>Resumen rápido de entradas y salidas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Entradas</p>
                            <p className="text-xs text-muted-foreground">Cobros realizados</p>
                        </div>
                    </div>
                    <span className="font-bold text-green-600">
                        {formatMoney(financials.income)}
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Salidas</p>
                            <p className="text-xs text-muted-foreground">Gastos operativos</p>
                        </div>
                    </div>
                    <span className="font-bold text-red-600">
                        {formatMoney(financials.expense)}
                    </span>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
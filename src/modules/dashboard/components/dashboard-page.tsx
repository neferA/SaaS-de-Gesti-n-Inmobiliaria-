import { useEffect, useState } from "react"
import { 
  Users, Home, Wallet, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Loader2, Building, Lock 
} from "lucide-react"
import { toast } from "sonner"
import { Link } from "react-router" 

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/modules/core/components/card"
import { Button } from "@/modules/core/components/button"
import { Progress } from "@/modules/core/components/progress" 

// Servicios
import { unitsService} from "@/modules/units/services/units.service"
import { tenantsService} from "@/modules/tenants/services/tenants.service"
import { transactionsService, type DashboardResponse } from "@/modules/transactions/services/transactions.service"
import { useAuth } from "@/modules/auth/hooks/use-auth"

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true)  
  const { isAdmin, user } = useAuth()
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

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        // ✅ SOLUCIÓN: Usamos Promise.resolve(null) si no es admin.
        // Esto mantiene el orden [0, 1, 2] siempre constante y evita errores de tipos.
        const [unitsData, tenantsData, financeData] = await Promise.all([
          unitsService.getAll(),
          tenantsService.getAll(),
          isAdmin ? transactionsService.getReport(month, year) : Promise.resolve(null)
        ])

        // 1. Cálculos de Unidades e Inquilinos
        const totalUnits = unitsData.length
        // Asegúrate de que tu backend devuelve "isOccupied" (booleano) o ajusta a tu propiedad real
        const occupiedUnits = unitsData.filter((u: any) => u.isOccupied).length 
        const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0

        setStats({
          totalUnits,
          occupiedUnits,
          occupancyRate,
          totalTenants: tenantsData.length
        })

        // 2. Datos Financieros (Solo si financeData no es null)
        if (financeData) {
            setFinancials(financeData.summary)
        }

      } catch (error) {
        console.error("Error cargando dashboard:", error)
        toast.error("Error al cargar datos.")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [isAdmin])

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
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel Principal</h2>
          <p className="text-muted-foreground">
            Hola, <span className="font-medium text-foreground">{user?.firstName}</span>Aquí tienes el resumen de hoy.
          </p>
        </div>
        <div className="flex gap-2">
            <Link to="/dashboard/tenants">
                <Button variant="outline">Gestión Inquilinos</Button>
            </Link>
            {/* Solo Admin puede registrar pagos directamente desde aquí si quieres */}
            <Link to="/dashboard/transactions">
                <Button>Registrar Movimiento</Button>
            </Link>
        </div>
      </div>

      {/* 1. SECCIÓN DE KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* INGRESO (SOLO ADMIN) */}
        {isAdmin ? (
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos (Mes)</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatMoney(financials.income)}</div>
                <p className="text-xs text-muted-foreground">Calculado automáticamente</p>
            </CardContent>
            </Card>
        ) : (
            // Card bloqueada para personal
            <Card className="bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos</CardTitle>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-muted-foreground">---</div>
                    <p className="text-xs text-muted-foreground">Acceso restringido</p>
                </CardContent>
            </Card>
        )}

        {/* OCUPACIÓN (VISIBLE PARA TODOS) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <Home className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.occupancyRate)}%</div>
            <Progress value={stats.occupancyRate} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.occupiedUnits}/{stats.totalUnits} unidades
            </p>
          </CardContent>
        </Card>

        {/* INQUILINOS (VISIBLE PARA TODOS) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquilinos</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">Activos en sistema</p>
          </CardContent>
        </Card>

        {/* GANANCIA NETA (SOLO ADMIN) */}
        {isAdmin ? (
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
                <Wallet className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${financials.netProfit >= 0 ? 'text-primary' : 'text-red-500'}`}>
                    {formatMoney(financials.netProfit)}
                </div>
                <p className="text-xs text-muted-foreground">Ingresos - Gastos</p>
            </CardContent>
            </Card>
        ) : (
             <Card className="bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Ganancia Neta</CardTitle>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-muted-foreground">---</div>
                    <p className="text-xs text-muted-foreground">Acceso restringido</p>
                </CardContent>
            </Card>
        )}
      </div>

      {/* 2. SECCIÓN INFERIOR */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* ESTADO PROPIEDAD */}
        <Card className="col-span-4 bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Estado de la Propiedad
                </CardTitle>
                <CardDescription>
                    Tienes <strong>{stats.totalUnits - stats.occupiedUnits} unidades disponibles</strong> para alquilar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link to="/dashboard/units">
                    <Button variant="secondary" className="w-full sm:w-auto">
                        Ver Inventario
                    </Button>
                </Link>
            </CardContent>
        </Card>

        {/* FLUJO DE CAJA (SOLO ADMIN) */}
        {isAdmin && (
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Flujo de Caja</CardTitle>
                    <CardDescription>Entradas vs Salidas del mes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium">Entradas</span>
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
                            <span className="text-sm font-medium">Salidas</span>
                        </div>
                        <span className="font-bold text-red-600">
                            {formatMoney(financials.expense)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}
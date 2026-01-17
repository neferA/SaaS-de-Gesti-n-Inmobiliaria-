import { useState, useEffect } from "react"
import { 
  Search, ArrowUpCircle, ArrowDownCircle, Calendar, 
  Loader2, Wallet, Tag, Filter 
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns" 
import { es } from "date-fns/locale"

// 👇 Importamos Input (ahora sí lo usaremos)
import { Input } from "@/modules/core/components/input"
import { Badge } from "@/modules/core/components/badge"
// ❌ Eliminamos Button de aquí porque no lo usamos directo

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/modules/core/components/table"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/modules/core/components/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/modules/core/components/select"

import { transactionsService, type DashboardResponse } from "../services/transactions.service"
import { CreateTransactionDialog } from "./create-transaction-dialog"

export const TransactionsPage = () => {
  const [loading, setLoading] = useState(true)

  // Filtros de fecha
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString())
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  
  // Estado para el buscador local
  const [searchTerm, setSearchTerm] = useState("")

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await transactionsService.getReport(Number(selectedMonth), Number(selectedYear))
      setDashboardData(data)
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar el reporte")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedMonth, selectedYear])

  // Filtrado local para el buscador
  const filteredTransactions = dashboardData?.transactions.filter(tx => 
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.amount.includes(searchTerm) ||
    (tx.category && tx.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), "dd MMM yyyy", { locale: es })
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transacciones</h2>
          <p className="text-muted-foreground">
             Reporte del periodo: <span className="font-bold text-primary">{dashboardData?.period || "-"}</span>
          </p>
        </div>
        <CreateTransactionDialog onTransactionCreated={fetchData} />
      </div>

      {/* BARRA DE FILTROS (Mes/Año) */}
      <div className="flex items-center gap-2 p-4 bg-muted/20 rounded-lg border">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Periodo:</span>
        
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-35 bg-background">
                <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="1">Enero</SelectItem>
                <SelectItem value="2">Febrero</SelectItem>
                <SelectItem value="3">Marzo</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Mayo</SelectItem>
                <SelectItem value="6">Junio</SelectItem>
                <SelectItem value="7">Julio</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Septiembre</SelectItem>
                <SelectItem value="10">Octubre</SelectItem>
                <SelectItem value="11">Noviembre</SelectItem>
                <SelectItem value="12">Diciembre</SelectItem>
            </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-25 bg-background">
                <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {/* CARDS DE RESUMEN (Datos del Backend) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : formatMoney(dashboardData?.summary.income || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos</CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-red-600">
                    {loading ? "..." : formatMoney(dashboardData?.summary.expense || 0)}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${
                    (dashboardData?.summary.netProfit || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                    {loading ? "..." : formatMoney(dashboardData?.summary.netProfit || 0)}
                </div>
            </CardContent>
        </Card>
      </div>

      {/* 👇 BUSCADOR LOCAL (Esto elimina las advertencias de unused imports) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search" 
                placeholder="Buscar en este mes..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* TABLA DE MOVIMIENTOS */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                            {dashboardData?.transactions.length === 0 
                                ? "No hay movimientos en este periodo." 
                                : "No se encontraron resultados con esa búsqueda."}
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                        <TableCell className="flex items-center gap-2 whitespace-nowrap">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(tx.date)}
                        </TableCell>
                        <TableCell className="font-medium max-w-75 truncate" title={tx.description}>
                            {tx.description}
                        </TableCell>
                        <TableCell>
                            {tx.category ? (
                                <Badge variant="outline" className="flex w-fit gap-1 items-center">
                                    <Tag className="h-3 w-3" />
                                    {tx.category.replace(/_/g, " ")}
                                </Badge>
                            ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                            )}
                        </TableCell>
                        <TableCell>
                            {tx.type === 'INGRESO' ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                                    INGRESO
                                </Badge>
                            ) : (
                                <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                    GASTO
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell className={`text-right font-bold ${
                            tx.type === 'INGRESO' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {tx.type === 'INGRESO' ? '+' : '-'} {formatMoney(Number(tx.amount))}
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
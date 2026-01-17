import { useState, useEffect } from "react"
import { Search, Loader2, FileClock, User, Home, FileText, Clock } from "lucide-react"
import { format, differenceInMonths, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"

import { Input } from "@/modules/core/components/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/modules/core/components/table"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/modules/core/components/card"
import { Badge } from "@/modules/core/components/badge"

import { historyService, type HistoryRecord } from "../services/history.service"

export const HistoryPage = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const data = await historyService.getAll()
      setRecords(data)
    } catch (error) {
      console.error("Error cargando historial:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  // 🔍 Filtro: Busca por Nombre (que viene en firstName), CI o Unidad
  const filteredRecords = records.filter((record) => 
    record.tenant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.tenant.ci.includes(searchTerm) ||
    record.unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Formateador de fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es })
    } catch {
      return dateString
    }
  }

  // 🧮 Calcular duración exacta (Meses y días)
  const getDuration = (start: string, end: string) => {
    try {
        const s = new Date(start)
        const e = new Date(end)
        
        const months = differenceInMonths(e, s)
        const days = differenceInDays(e, s) % 30 // Aproximado

        if (months > 0) {
            return `${months} mes${months > 1 ? 'es' : ''}${days > 0 ? ` y ${days} días` : ''}`
        }
        return `${days} días`
    } catch {
        return "-"
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Historial de Alquileres</h2>
        <p className="text-muted-foreground">Registro de contratos finalizados y observaciones de salida.</p>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search" 
                placeholder="Buscar por nombre, CI o unidad..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileClock className="h-5 w-5" /> Registros Pasados
          </CardTitle>
          <CardDescription>
            Mostrando {filteredRecords.length} registros históricos.
          </CardDescription>
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
                  <TableHead>Inquilino</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Observaciones / Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                            {records.length === 0 
                                ? "No hay historial registrado aún." 
                                : "No se encontraron resultados con esa búsqueda."}
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                        {/* Inquilino */}
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium flex items-center gap-2">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    {/* Backend manda nombre completo en firstName */}
                                    {record.tenant.firstName} 
                                </span>
                                <span className="text-xs text-muted-foreground ml-5 font-mono bg-muted px-1 rounded w-fit">
                                    CI: {record.tenant.ci}
                                </span>
                            </div>
                        </TableCell>

                        {/* Unidad */}
                        <TableCell>
                             <Badge variant="secondary" className="flex w-fit gap-1 items-center">
                                <Home className="h-3 w-3" />
                                {record.unit.name}
                             </Badge>
                        </TableCell>

                        {/* Fechas (Inicio -> Fin) */}
                        <TableCell>
                            <div className="flex flex-col text-sm">
                                <span className="text-green-600 flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground">Del:</span> 
                                    {formatDate(record.startDate)}
                                </span>
                                <span className="text-red-600 flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground">Al:</span> 
                                    {formatDate(record.endDate)}
                                </span>
                            </div>
                        </TableCell>

                        {/* Duración Calculada */}
                        <TableCell>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span className="text-sm">{getDuration(record.startDate, record.endDate)}</span>
                            </div>
                        </TableCell>

                        {/* NOTAS (Nuevo campo del modelo RentalHistory) */}
                        <TableCell className="max-w-62.5">
                            {record.notes ? (
                                <div className="flex items-start gap-2 bg-yellow-50/50 p-2 rounded-md border border-yellow-100 text-sm text-yellow-800">
                                    <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                                    <p className="leading-tight">{record.notes}</p>
                                </div>
                            ) : (
                                <span className="text-muted-foreground text-xs italic">Sin observaciones</span>
                            )}
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
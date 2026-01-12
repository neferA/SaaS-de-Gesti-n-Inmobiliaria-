import { Search, FileClock, User, Home, StickyNote } from "lucide-react"

import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/modules/core/components/table"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/modules/core/components/card"

// Mock Data basado en tu modelo RentalHistory
const history = [
  {
    id: "hist-1",
    unitName: "Dpto 101",
    tenantName: "Roberto Gómez",
    tenantCi: "4567890 LP",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    notes: "Se fue debiendo 50Bs de luz. Dejó la pared sucia.",
  },
  {
    id: "hist-2",
    unitName: "Cuarto Azul",
    tenantName: "Ana Méndez",
    tenantCi: "1122334 SC",
    startDate: "2023-06-01",
    endDate: "2023-09-01",
    notes: "Todo excelente. Inquilino recomendado.",
  },
  {
    id: "hist-3",
    unitName: "Dpto 102",
    tenantName: "Carlos Vela",
    tenantCi: "9988776 CB",
    startDate: "2022-01-01",
    endDate: "2023-01-01",
    notes: null, // Sin notas
  },
]

export const HistoryPage = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Historial de Alquileres</h2>
          <p className="text-muted-foreground">Registro histórico de ocupación y finalización de contratos.</p>
        </div>
        {/* No hay botón de "Crear" porque esto es automático del sistema */}
        <Button variant="outline" disabled>
            <FileClock className="mr-2 h-4 w-4" /> Exportar Informe
        </Button>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                type="search" 
                placeholder="Buscar por inquilino o CI..." 
                className="pl-8" 
            />
        </div>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Archivo de Contratos Finalizados</CardTitle>
          <CardDescription>
            Mostrando {history.length} registros históricos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidad</TableHead>
                <TableHead>Inquilino Anterior</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Notas / Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        {record.unitName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {record.tenantName}
                        </span>
                        <span className="text-xs text-muted-foreground pl-4">
                            CI: {record.tenantCi}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                            <span className="text-xs text-muted-foreground">Del:</span> {record.startDate}
                        </span>
                        <span className="flex items-center gap-1 text-red-500">
                            <span className="text-xs text-muted-foreground">Al:</span> {record.endDate}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.notes ? (
                        <div className="flex items-start gap-2 max-w-75">                            
                            <StickyNote className="h-4 w-4 text-yellow-500 mt-1 shrink-0" />
                            <p className="text-sm italic text-muted-foreground">{record.notes}</p>
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground">- Sin observaciones -</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
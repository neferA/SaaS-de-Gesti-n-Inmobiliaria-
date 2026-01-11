import { 
  Download, 
  Filter, 
  MoreHorizontal, 
  Search, 
  CalendarIcon
} from "lucide-react"

import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import { Badge } from "@/modules/core/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/core/components/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/core/components/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/core/components/card"
import { CreateTransactionDialog } from "./create-transaction-dialog"

// Datos de prueba (Mock Data)
const transactions = [
  {
    id: "TRX-9871",
    tenant: "Juan Pérez",
    unit: "Dpto 101",
    amount: 1500.00,
    date: "2024-01-05",
    status: "completed", // completed, pending, failed
    method: "QR", // QR, Cash, Bank
    type: "Alquiler"
  },
  {
    id: "TRX-9872",
    tenant: "María Gonzales",
    unit: "Dpto 102",
    amount: 300.00,
    date: "2024-01-06",
    status: "completed",
    method: "Efectivo",
    type: "Expensas"
  },
  {
    id: "TRX-9873",
    tenant: "Carlos Ruiz",
    unit: "Habitación 3",
    amount: 800.00,
    date: "2024-01-10",
    status: "pending",
    method: "Pendiente",
    type: "Alquiler"
  },
  {
    id: "TRX-9874",
    tenant: "Ana Lopez",
    unit: "Dpto 201",
    amount: 1500.00,
    date: "2024-01-02",
    status: "failed",
    method: "Transferencia",
    type: "Alquiler"
  },
]

export const TransactionsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transacciones</h2>
          <p className="text-muted-foreground">Historial de pagos y cobros.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Exportar
            </Button>
            <CreateTransactionDialog/>
        </div>
      </div>

      {/* 2. TABLA */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
                <CardTitle>Pagos Recientes</CardTitle>
                <CardDescription>
                    Gestiona los ingresos financieros de las propiedades.
                </CardDescription>
            </div>
            {/* Buscador pequeño en el header de la carta */}
            <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar recibo..." 
                    className="h-8 w-37.5 lg:w-62.5"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <Filter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Filtro
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>Pagados</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Pendientes</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Rechazados</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recibo ID</TableHead>
                <TableHead>Inquilino</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((trx) => (
                <TableRow key={trx.id}>
                  <TableCell className="font-medium">{trx.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span>{trx.tenant}</span>
                        <span className="text-xs text-muted-foreground">{trx.unit}</span>
                    </div>
                  </TableCell>
                  <TableCell>{trx.type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-3 w-3" />
                        {trx.date}
                    </div>
                  </TableCell>
                  <TableCell>{trx.method}</TableCell>
                  <TableCell>
                    {trx.status === 'completed' && <Badge variant="default" className="bg-green-600 hover:bg-green-700">Pagado</Badge>}
                    {trx.status === 'pending' && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendiente</Badge>}
                    {trx.status === 'failed' && <Badge variant="destructive">Fallido</Badge>}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${trx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Recibo</DropdownMenuItem>
                        <DropdownMenuItem>Descargar PDF</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Anular Pago</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
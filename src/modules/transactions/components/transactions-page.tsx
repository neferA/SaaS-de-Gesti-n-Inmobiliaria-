import { Download, Filter, MoreHorizontal, Search, CalendarIcon, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

import { Button } from "@/modules/core/components/button"
import { Input } from "@/modules/core/components/input"
import { Badge } from "@/modules/core/components/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/modules/core/components/table"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/modules/core/components/dropdown-menu"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/modules/core/components/card"

import { CreateTransactionDialog } from "./create-transaction-dialog"

// DATOS DE PRUEBA: Nota cómo incluimos el nombre del inquilino en la descripción
const transactions = [
  {
    id: "TRX-1",
    description: "Cobro Alquiler Enero - Juan Pérez", // <--- El inquilino va aquí
    amount: 2500.00,
    date: "2024-01-05",
    type: "INGRESO",
    category: "ALQUILER_MENSUAL"
  },
  {
    id: "TRX-2",
    description: "Pago factura de luz - Medidor General",
    amount: 150.50,
    date: "2024-01-10",
    type: "GASTO",
    category: "LUZ_GENERAL"
  },
  {
    id: "TRX-3",
    description: "Reparación Grifo Dpto 2 - Plomero",
    amount: 300.00,
    date: "2024-01-12",
    type: "GASTO",
    category: "MANTENIMIENTO_GENERAL"
  },
]

export const TransactionsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transacciones</h2>
          <p className="text-muted-foreground">Historial financiero (Caja).</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Exportar
            </Button>
            <CreateTransactionDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
                <CardTitle>Movimientos Recientes</CardTitle>
                <CardDescription>
                    Ingresos y Gastos registrados en el sistema.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar..." 
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
                        <DropdownMenuCheckboxItem checked>Ingresos</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked>Gastos</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {/* Modificamos el título de la columna para ser explícitos */}
                <TableHead className="w-[40%]">Descripción / Responsable</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((trx) => (
                <TableRow key={trx.id}>
                  {/* Aquí mostramos la descripción con énfasis */}
                  <TableCell className="font-medium">
                    {trx.description}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {trx.category.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-3 w-3" />
                        {trx.date}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {trx.type === 'INGRESO' ? (
                         <div className="flex items-center text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full w-fit">
                            <ArrowUpCircle className="mr-1 h-3 w-3" /> INGRESO
                         </div>
                    ) : (
                        <div className="flex items-center text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-full w-fit">
                            <ArrowDownCircle className="mr-1 h-3 w-3" /> GASTO
                        </div>
                    )}
                  </TableCell>
                  
                  <TableCell className={`text-right font-bold whitespace-nowrap ${trx.type === 'INGRESO' ? 'text-green-600' : 'text-red-600'}`}>
                    {trx.type === 'INGRESO' ? '+' : '-'} Bs. {trx.amount.toFixed(2)}
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Detalle</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
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
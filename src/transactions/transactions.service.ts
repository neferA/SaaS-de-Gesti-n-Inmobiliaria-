import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. REGISTRAR MOVIMIENTO (Ingreso o Gasto)
  async create(createTransactionDto: CreateTransactionDto) {
    const { date, category, ...rest } = createTransactionDto;

    const transaction = await this.prisma.transaction.create({
      data: {
        ...rest,
        // Si no envía categoría (ej. Ingreso), Prisma lo acepta como null gracias al cambio que hicimos
        category: category, 
        // Si envía fecha manual la usamos, si no, usa la fecha actual
        date: date ? new Date(date) : new Date(),
      },
    });

    return {
      message: 'Movimiento registrado correctamente',
      data: transaction
    };
  }

  // 2. LISTAR TODO (Historial completo)
  async findAll() {
    return await this.prisma.transaction.findMany({
      orderBy: { date: 'desc' }, // Lo más reciente primero
    });
  }

  // 3. REPORTE MENSUAL (El cerebro del Dashboard)
  async getMonthlyBalance(month: number, year: number) {
    // Definimos el rango exacto del mes (del día 1 al último)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Traemos solo las transacciones de ese mes
    const transactions = await this.prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    // Calculamos Totales en memoria (Rápido y eficiente para <10k registros)
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INGRESO)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter(t => t.type === TransactionType.GASTO)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      period: `${month}/${year}`,
      summary: {
        income: totalIncome,
        expense: totalExpense,
        netProfit: totalIncome - totalExpense, // Tu ganancia neta real
      },
      transactions: transactions // Devolvemos la lista para pintar la tabla
    };
  }
}
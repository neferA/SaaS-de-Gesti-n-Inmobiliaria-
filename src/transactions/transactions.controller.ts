import { Controller, Get, Post, Body, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get() 
  findAll() {
    return this.transactionsService.findAll();
  }

  // Ruta especial para el Dashboard
  // Ejemplo: GET /transactions/report?month=1&year=2026
  @Get('report')
  getReport(
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
    @Request() req // 👈 1. Inyectamos la petición
  ) {
    // 2. Pasamos 'req.user' (el usuario logueado) al servicio
    return this.transactionsService.getMonthlyBalance(month, year, req.user);
  }
}
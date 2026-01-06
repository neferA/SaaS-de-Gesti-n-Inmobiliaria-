import { IsString, IsNotEmpty, IsEnum, IsNumber, IsPositive, IsOptional, IsDateString } from 'class-validator';
import { TransactionType, ExpenseCategory } from '@prisma/client'; // Importamos los Enums nativos

export class CreateTransactionDto {
  @IsEnum(TransactionType, {
    message: 'El tipo debe ser INGRESO o GASTO',
  })
  type: TransactionType;

  @IsOptional()
  @IsEnum(ExpenseCategory, {
    message: 'Categoría inválida. Ej: AGUA_MEDIDOR_1, LUZ_GENERAL, ALQUILER_MENSUAL...',
  })
  category?: ExpenseCategory;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string; 
  // OJO: Aquí el frontend debe enviar texto explícito. 
  // Ej: "Pago Alquiler Enero - Juan Perez - Dpto 1"
  // Esto es lo que nos salva del Hard Delete.

  @IsOptional()
  @IsDateString()
  date?: string; // Por si quieres registrar un gasto de ayer
}
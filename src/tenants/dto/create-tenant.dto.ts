import { IsString, IsNotEmpty, IsUUID, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  ci: string; // Cédula de Identidad

  @IsString()
  @IsOptional()
  phone?: string;

  // Datos para asignar el cuarto inmediatamente
  @IsUUID()
  @IsNotEmpty()
  unitId: string;

  @IsNumber()
  @IsPositive()
  price: number; // Precio acordado (puede ser distinto al base)
}
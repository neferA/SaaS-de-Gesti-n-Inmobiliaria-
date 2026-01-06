import { IsString, IsNotEmpty, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { UnitType } from '@prisma/client'; // Importamos el Enum nativo de Prisma

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Ej: "Dpto 101"

  @IsEnum(UnitType, {
    message: 'El tipo debe ser DEPARTAMENTO o CUARTO',
  })
  type: UnitType;

  @IsNumber()
  @IsPositive()
  basePrice: number;
}
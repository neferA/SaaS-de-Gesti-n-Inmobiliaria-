import { IsPositive, IsEmail, IsString, IsNotEmpty, MinLength, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  
  @IsEmail({}, { message: 'El correo debe tener un formato válido (ej: usuario@dominio.com)' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @IsPositive({ message: 'El ID del rol debe ser un número positivo (1, 2, ...)' }) 
  roleId: number;
}
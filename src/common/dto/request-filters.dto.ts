import { IsOptional, IsPositive, IsInt, Min, IsString } from 'class-validator'; // 👈 Agrega IsString
import { Type } from 'class-transformer';

export class RequestFiltersDto {
  
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
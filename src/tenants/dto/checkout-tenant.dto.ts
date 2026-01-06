// src/tenants/dto/checkout-tenant.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CheckoutTenantDto {
  @IsString()
  @IsOptional()
  notes?: string; // Ej: "Dejó la llave en portería, todo OK"
}
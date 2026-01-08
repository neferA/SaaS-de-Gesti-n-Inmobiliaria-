import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CheckoutTenantDto } from './dto/checkout-tenant.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tenants')
@UseGuards(AuthGuard('jwt'))
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  // Endpoint especial para dar de baja
  // Usamos POST en lugar de DELETE porque enviamos un body con notas
  // Ruta: POST /tenants/:id/checkout
  @Post(':id/checkout')
  checkout(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() checkoutDto: CheckoutTenantDto
  ) {
    return this.tenantsService.checkout(id, checkoutDto);
  }
}
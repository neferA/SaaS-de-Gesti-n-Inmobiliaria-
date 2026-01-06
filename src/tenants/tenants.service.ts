import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CheckoutTenantDto } from './dto/checkout-tenant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. CREAR (Check-In)
  async create(createTenantDto: CreateTenantDto) {
    const { unitId, price, ...tenantData } = createTenantDto;

    // Verificar si la unidad existe y está vacía
    const unit = await this.prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) throw new NotFoundException('La unidad no existe');
    if (unit.isOccupied) throw new BadRequestException('Esta unidad ya está ocupada');

    const newTenant = await this.prisma.$transaction(async (tx) => {
      // A) Crear Inquilino
      const tenant = await tx.tenant.create({
        data: tenantData,
      });

      // B) Crear Contrato
      await tx.lease.create({
        data: {
          unitId: unitId,
          tenantId: tenant.id,
          startDate: new Date(),
          price: price,
          isActive: true,
        },
      });

      // C) Marcar Unidad como Ocupada
      await tx.unit.update({
        where: { id: unitId },
        data: { isOccupied: true },
      });

      return tenant;
    });

    return {
      message: 'Inquilino registrado y contrato generado correctamente',
      data: newTenant
    };
  }

  // 2. LISTAR TODOS (Faltaba esto)
  async findAll() {
    return await this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        leases: {
          where: { isActive: true },
          include: { unit: true }, // Traemos info del depa (nombre, precio)
        },
      },
    });
  }

  // 3. OBTENER UNO (Faltaba esto)
  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        leases: {
          where: { isActive: true },
          include: { unit: true },
        },
      },
    });

    if (!tenant) throw new NotFoundException(`Inquilino con ID ${id} no encontrado`);
    return tenant;
  }

  // 4. ACTUALIZAR
  async update(id: string, updateTenantDto: UpdateTenantDto) {
    // Verificamos que exista primero
    await this.findOne(id);

    const updatedTenant = await this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });

    return {
      message: 'Datos del inquilino actualizados',
      data: updatedTenant
    };
  }

  // 5. CHECK-OUT (Salida + Historial + Hard Delete)
  async checkout(id: string, checkoutDto: CheckoutTenantDto) {
    await this.prisma.$transaction(async (tx) => {
      // A) Obtener datos antes de borrar
      const tenant = await tx.tenant.findUnique({
        where: { id },
        include: { leases: { where: { isActive: true }, include: { unit: true } } },
      });

      if (!tenant) throw new NotFoundException('Inquilino no encontrado');
      
      const activeLease = tenant.leases[0]; 
      
      // B) Guardar Historial si hay contrato
      if (activeLease) {
        await tx.rentalHistory.create({
          data: {
            unitName: activeLease.unit.name,
            tenantName: tenant.fullName,
            tenantCi: tenant.ci,
            startDate: activeLease.startDate,
            endDate: new Date(), 
            notes: checkoutDto.notes || 'Salida normal',
          },
        });

        // C) Liberar el Cuarto
        await tx.unit.update({
          where: { id: activeLease.unitId },
          data: { isOccupied: false },
        });
      }

      // D) HARD DELETE del Inquilino
      await tx.tenant.delete({
        where: { id },
      });
    });

    return {
      message: 'Check-out completado. Historial guardado e inquilino eliminado.',
      id: id
    };
  }
}
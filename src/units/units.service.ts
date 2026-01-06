import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUnitDto: CreateUnitDto) {
    const newUnit = await this.prisma.unit.create({
      data: createUnitDto,
    });

    return {
      message: 'Unidad creada correctamente',
      data: newUnit
    };
  }

  async findAll() {
    const units = await this.prisma.unit.findMany({
      orderBy: { name: 'asc' },
    });
    
    return units; 
  }

  async findOne(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        leases: { where: { isActive: true } }
      }
    });

    if (!unit) throw new NotFoundException(`La unidad con ID ${id} no existe`);
    
    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    // 1. Verificar existencia antes de intentar actualizar
    await this.findOne(id);

    // 2. Actualizar
    const updatedUnit = await this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
    });

    return {
      message: 'Unidad actualizada correctamente',
      data: updatedUnit
    };
  }

  async remove(id: string) {
    // 1. Verificar existencia y estado
    const unit = await this.findOne(id);

    // 2. Regla de Negocio: No borrar si hay gente viviendo
    if (unit.isOccupied) {
      throw new BadRequestException('No se puede eliminar: La unidad está ocupada actualmente.');
    }

    // 3. Eliminar
    await this.prisma.unit.delete({
      where: { id },
    });

    return {
      message: 'Unidad eliminada correctamente',
      id: id
    };
  }
}
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestFiltersDto } from '../common/dto/request-filters.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    
    constructor(private readonly prisma: PrismaService){}
        
    async findAll(filters: RequestFiltersDto) {
    const { page = 1, limit = 10, search } = filters;
    const skip = (page - 1) * limit;

    // filtro dinámico
    // Prisma usa 'mode: insensitive' para ignorar mayúsculas/minúsculas
    const whereClause = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } }, // Busca en Nombre
        { lastName: { contains: search, mode: 'insensitive' as const } },  // O en Apellido
        { email: { contains: search, mode: 'insensitive' as const } },     // O en Email
      ],
      // Si tienes Soft Delete, asegúrate de buscar solo activos:
      // AND: { isActive: true } 
    } : {}; // Si no hay search, el filtro está vacío (trae todo)

    // 2. Buscamos los usuarios con el filtro
    const users = await this.prisma.user.findMany({
      skip: skip,
      take: limit,
      where: whereClause, //Aplicamos el filtro 
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: { select: { name: true } },
        createdAt: true
      }
    });

    const totalUsers = await this.prisma.user.count({
      where: whereClause 
    });

    return {
      data: users,
      meta: {
        total: totalUsers,
        page: page,
        lastPage: Math.ceil(totalUsers / limit)
      }
    };
}
    async create(data: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          username: data.username, 
          firstName: data.firstName,
          lastName: data.lastName,
          roleId: data.roleId,
        },
        // Seleccionamos solo lo que queremos devolver
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          role: {
            select: { name: true }
          }
        }
      });

      // 2. Si llegamos aquí, fue un éxito. Retornamos respuesta estandarizada.
      return {
        message: '¡Usuario creado exitosamente!',
        user: newUser,
      };

    } catch (error) {
      // 3. CAPTURA DE ERRORES INTELIGENTE
      
      // El código 'P2002' es exclusivo de Prisma para "Unique constraint failed"
      // Significa que chocamos con el @unique del email en la DB
      if (error.code === 'P2002') {
        // Obtenemos qué campo falló (usualmente es 'email')
        const field = error.meta?.target?.[0] || 'campo';
        
        // Lanzamos un 409 Conflict (El código HTTP correcto para duplicados)
        throw new ConflictException(`El ${field} ya está registrado en el sistema.`);
      }

      // Si es cualquier otro error (DB caída, bug de código), lanzamos 500
      console.error('Error inesperado creando usuario:', error);
      throw new InternalServerErrorException('Error interno del servidor, revise los logs.');
    }
  }
        
    async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      
    const dataToUpdate = { ...updateUserDto };
    // Lógica de Encriptación
    if (dataToUpdate.password) {
      //console.log('🔄 Encriptando password nueva:', dataToUpdate.password);      
      const salt = await bcrypt.genSalt(10); // Generamos la sal explícitamente
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, salt);
      //console.log('✅ Hash generado:', dataToUpdate.password);
    }
      const updatedUser = await this.prisma.user.update({
        where: { id: id }, // Buscamos por ID
        data: dataToUpdate, // Pasamos los datos a actualizar
        select: { // Retornamos datos limpios
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: { select: { name: true } },
          updatedAt: true
        }
      });

      return {
        message: 'Usuario actualizado correctamente',
        data: updatedUser
      };

    } catch (error) {
      // Manejo de errores de Prisma

      // P2025: Record to update not found (No existe el ID)
      if (error.code === 'P2025') {
        throw new NotFoundException(`El usuario con ID ${id} no fue encontrado`);
      }

      // P2002: Unique constraint failed (Intentó poner un email que ya existe)
      if (error.code === 'P2002') {
        throw new ConflictException('El nuevo correo electrónico ya está en uso por otro usuario');
      }

      // Cualquier otro error
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }
    
    async remove(id: string) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id: id },
        // Seleccionamos solo datos básicos para confirmar qué borramos
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          username: true,
        }
      });

      return {
        message: 'Usuario eliminado físicamente del sistema',
        data: deletedUser
      };

    } catch (error) {
      // P2025: El registro a eliminar no existe
      if (error.code === 'P2025') {
        throw new NotFoundException(`El usuario con ID ${id} no existe`);
      }
      
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }
}


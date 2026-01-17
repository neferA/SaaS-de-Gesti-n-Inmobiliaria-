import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    // 1. Consultamos tu tabla de Snapshots
    const historyLogs = await this.prisma.rentalHistory.findMany({
      orderBy: { endDate: 'desc' }, // Ordenar por fecha de salida (lo más reciente arriba)
    });

    // 2. Transformamos los datos para que el Frontend (React) los entienda
    return historyLogs.map((log) => ({
      id: log.id,
      startDate: log.startDate,
      endDate: log.endDate,
      
      // Adaptamos el inquilino
      tenant: {
        
        firstName: log.tenantName, 
        lastName: "", 
        ci: log.tenantCi,
      },
      
      // Adaptamos la unidad
      unit: {
        name: log.unitName,
        type: "HISTORIAL", // Valor genérico
      },

      // Agregamos las notas por si quieres mostrarlas en un futuro
      notes: log.notes
    }));
  }

  // --- Métodos CRUD generados (No los necesitas por ahora) ---
  findOne(id: number) { return `This action returns a #${id} history`; }
  // ...
}
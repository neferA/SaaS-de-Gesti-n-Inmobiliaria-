import api from "@/modules/core/api/client";

export type UnitType = "DEPARTAMENTO" | "CUARTO"; 
export type UnitStatus = "DISPONIBLE" | "OCUPADO" | "MANTENIMIENTO";

// Interfaz de lo que devuelve la Base de Datos
export interface Unit {
  id: string;
  name: string;
  type: UnitType; 
  isOccupied: boolean;
  basePrice: number;
}

// 2. Interfaz del Payload (Coincide con CreateUnitDto)
export interface CreateUnitPayload {
  name: string;
  type: UnitType; 
  basePrice: number;
}

export const unitsService = {
  // Obtener todas las unidades
  getAll: async () => {
    const { data } = await api.get<Unit[]>("/units");
    return data;
  },

  // Crear Unidad (Enviando el DTO correcto)
  create: async (payload: CreateUnitPayload) => {
    const { data } = await api.post<Unit>("/units", payload);
    return data;
  },

  // Editar Unidad
  update: async (id: string, payload: Partial<CreateUnitPayload>) => {
    const { data } = await api.patch<Unit>(`/units/${id}`, payload);
    return data;
  },

  // Eliminar Unidad
  delete: async (id: string) => {
    const { data } = await api.delete(`/units/${id}`);
    return data;
  }
};
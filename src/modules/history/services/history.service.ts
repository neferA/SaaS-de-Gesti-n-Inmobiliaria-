import api from "@/modules/core/api/client";

export interface HistoryRecord {
  id: string;
  startDate: string;
  endDate: string;
  tenant: {
    firstName: string;
    lastName: string;
    ci: string;
  };
  unit: {
    name: string;
    type: string;
  };
  notes?: string; // (Opcional) Agregamos notes por si lo usas luego
}

export const historyService = {
  getAll: async () => {
    // 👇 CAMBIO IMPORTANTE: La ruta ahora es "/history"
    const { data } = await api.get<HistoryRecord[]>("/history");
    return data;
  }
};
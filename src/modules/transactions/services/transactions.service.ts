import api from "@/modules/core/api/client";

// Asegúrate de que coincidan con los de tu Prisma Schema
export type TransactionType = "INGRESO" | "GASTO";
export type ExpenseCategory = "AGUA_MEDIDOR_1" | "LUZ_GENERAL" | "ALQUILER_MENSUAL" | "MANTENIMIENTO" | "OTROS";

export interface Transaction {
  id: string;
  type: TransactionType;
  category?: ExpenseCategory; // Nuevo campo
  amount: string; // El backend manda string
  description: string;
  date: string;
}
export interface DashboardResponse {
  period: string;       // "1/2026"
  summary: {
    income: number;     // 7080
    expense: number;    // 4333.2
    netProfit: number;  // 2746.8
  };
  transactions: Transaction[]; // Array con los datos
}

export interface CreateTransactionPayload {
  type: TransactionType;
  category?: ExpenseCategory;
  amount: number;
  description: string; // Aquí va todo el detalle
  date?: string; // ISO Date
}

export const transactionsService = {
  // 👇 2. MODIFICAMOS GETREPORT PARA QUE DEVUELVA TODO EL PAQUETE
  getReport: async (month: number, year: number) => {
    // Axios devuelve el objeto completo que me mostraste
    const { data } = await api.get<DashboardResponse>('/transactions/report', {
      params: { month, year } 
    });
    return data;
  },
  
  create: async (payload: CreateTransactionPayload) => {
    const { data } = await api.post<Transaction>("/transactions", payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/transactions/${id}`);
    return data;
  }
};
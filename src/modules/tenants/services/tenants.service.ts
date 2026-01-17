import api from "@/modules/core/api/client";

// Definimos la forma exacta de los datos que vienen del backend
export interface Tenant {
  lease: any;
  id: string;
  fullName: string;
  ci: string; 
  phone?: string;
  isActive: boolean;
}

export interface CreateTenantPayload {
  fullName: string;
  ci: string;
  phone?: string;
}
export interface CheckoutPayload {
  notes?: string;
}
export const tenantsService = {
  // 1. Obtener lista completa
  getAll: async () => {
    const { data } = await api.get<Tenant[]>("/tenants");
    return data;
  },

  // 2. Crear nuevo inquilino
  create: async (payload: CreateTenantPayload) => {
    const { data } = await api.post<Tenant>("/tenants", payload);
    return data;
  },

  // 3. Editar inquilino
  update: async (id: string, payload: Partial<CreateTenantPayload>) => {
    const { data } = await api.patch<Tenant>(`/tenants/${id}`, payload);
    return data;
  },
  checkout: async (id: string, payload: CheckoutPayload) => {
    // POST /tenants/:id/checkout
    const { data } = await api.post(`/tenants/${id}/checkout`, payload);
    return data;
  },
  // 4. Eliminar (o desactivar) inquilino
  delete: async (id: string) => {
    const { data } = await api.delete(`/tenants/${id}`);
    return data;
  },
};
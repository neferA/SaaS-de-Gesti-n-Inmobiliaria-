import api from "@/modules/core/api/client";


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role?: {
    name: string;
  };
  createdAt: string;
}

export interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  roleId: number; 
}

export const usersService = {
  
  // GET: Listar con paginación y búsqueda
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    // Axios convierte automáticamente params a query string: ?page=1&search=juan
    const { data } = await api.get<UsersResponse>("/users", { params });
    return data;
  },

  // POST: Crear nuevo usuario
  create: async (payload: CreateUserPayload) => {
    const { data } = await api.post("/users", payload);
    return data;
  },

  // DELETE: Eliminar usuario
  delete: async (id: string) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  // PATCH: Editar usuario (Opcional, estructura preparada)
  update: async (id: string, payload: Partial<CreateUserPayload>) => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  }
};
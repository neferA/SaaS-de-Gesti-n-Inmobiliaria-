import api from "@/modules/core/api/client";

export interface LoginResponse {
  accessToken?: string;
  access_token?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

// 1. Definimos los datos que pide el registro
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export const authService = {
  login: async (credentials: LoginPayload) => {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    return data;
  },

  // 2. Agregamos la función de registro
 register: async (payload: RegisterPayload) => {
    // 👇 TRUCO: Si no hay rol, enviamos 'viewer' o 'user' por defecto
    const dataToSend = {
        ...payload,
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        
        // 1. Generamos el username basado en el email (ej: juan@test.com -> juan)
        username: payload.email.split('@')[0], 
        
        // 2. Enviamos el ID numérico del rol (Según tu JSON, 1 funciona)
        roleId: 2
    };
    
    // Asumimos que el backend tiene este endpoint habilitado
    const { data } = await api.post("/users", dataToSend);
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
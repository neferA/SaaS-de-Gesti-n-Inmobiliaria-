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
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
export const authService = {
  login: async (credentials: LoginPayload) => {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    return data;
  },

  // 2. Agregamos la función de registro
 register: async (payload: RegisterPayload) => {
    const dataToSend = {
        ...payload,
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.email.split('@')[0], 
        roleId: 2
    };
    const { data } = await api.post("/users", dataToSend);
    return data;
  },

 update: async (id: string, payload: any) => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
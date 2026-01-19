import axios from "axios";
// 1. Instancia (Esto está perfecto)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor (Perfecto)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (AJUSTADO) 🔧
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend dice "No autorizado" (Token vencido, modificado o inexistente)
    if (error.response?.status === 401) {
      console.warn("Sesión caducada. Limpiando credenciales...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/auth/login") {
         window.location.href = "/auth/login?reason=session_expired";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
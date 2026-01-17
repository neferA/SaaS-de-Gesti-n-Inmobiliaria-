import axios from "axios";

// 1. Creamos la instancia de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Lee la variable del .env
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. INTERCEPTOR DE PETICIONES (Request)
// Antes de que salga la petición, inyectamos el Token JWT automáticamente.
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

// 3. INTERCEPTOR DE RESPUESTAS (Response)
// (Opcional) Aquí podemos manejar errores globales, como cuando expira la sesión.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sesión no autorizada o token expirado.");
      // Opcional: localStorage.removeItem("token");
      // Opcional: window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
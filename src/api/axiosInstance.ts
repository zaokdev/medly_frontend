import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // 🔥 ESTA ES LA LÍNEA MÁGICA PARA REDIS/COOKIES
  // Le dice al navegador: "Envía y recibe cookies de este servidor"
  withCredentials: true,
});

// 2. Interceptor de Solicitud (Request)
// YA NO NECESITAS inyectar el token manualmente.
// Eliminamos el interceptor de 'Authorization: Bearer...'
// El navegador pegará la cookie 'connect.sid' (o como la hayas llamado) automáticamente.

// 3. Interceptor de Respuesta (Response)
// src/api/axiosInstance.js

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 1. OMITIR RECARGA EN EL ENDPOINT '/me' (Checkeo de sesión)
      if (error.config.url.includes("/me")) {
        return Promise.reject(error.response.data);
      }

      // 2. OMITIR RECARGA EN EL ENDPOINT '/login' (Contraseña incorrecta)
      // Aquí queremos que el usuario vea el mensaje rojo, no que se recargue la página.
      if (error.config.url.includes("/login")) {
        return Promise.reject(error.response.data);
      }

      // 3. SOLO REDIRIGIR SI ESTABA NAVEGANDO DENTRO DE LA APP
      // Si estaba en /dashboard y caducó la sesión, ahí sí lo sacamos.
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Devolvemos el error para que tu try/catch lo pueda leer
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default api;

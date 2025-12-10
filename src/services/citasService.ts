import api from "../api/axiosInstance";

export const citasService = {
  // 1. Obtener Doctores con Filtros (Conecta con tu getAllDoctors)
  getAllDoctors: async (search = "", especialidadId: any | null = null) => {
    // Construimos los query params: ?search=Juan&especialidad=2
    const params: any = {};
    if (search) params.search = search;
    if (especialidadId) params.especialidad = especialidadId;

    // Axios se encarga de convertir el objeto params en string URL
    const response = await api.get("/search/all-doctors", { params });
    return response;
  },

  getDoctorSchedule: async (doctorId: Number | String) => {
    // Asumo que tu endpoint es algo como /schedule?id=9
    return await api.get(`/search/schedule?id=${doctorId}`);
  },

  bookSchedule: async (id: Number | String) => {
    return await api.post(`/appointments/book-appointment`, { id });
  },

  getMyAppointments: async () => {
    // No enviamos ID, la cookie le dice al backend quiénes somos
    return await api.get("/appointments/get-appointments");
  },

  // (Opcional) Función para cancelar si la necesitas
  cancelAppointment: async (citaId: String | Number) => {
    return await api.delete(`/appointments/cancel-apointment`, {
      data: {
        id: citaId,
      },
    });
  },
};

import api from "../api/axiosInstance";

export const doctorService = {
  // 1. Obtener citas (El backend ya las trae ordenadas)
  getMyAppointments: async () => {
    return await api.get("/doctors/get-appointments");
  },

  // 2. Abrir Horarios
  // Recibe un array de slots y lo envuelve en { horarios: [...] }
  openSchedule: async (slots: { hora: any; fecha: any }) => {
    return await api.post("/doctors/open-schedules", {
      horarios: slots,
    });
  },

  // (Pendiente) Buscar Pacientes
  searchPatients: async (query = "", page = 1) => {
    const response = await api.get(`/search/doctors/get-patients`, {
      params: {
        search: query,
        page,
      },
    });

    return response;
  },

  getRecord: async (query = "") => {
    return await api.get(`/search/doctors/get-record?id=${query}`);
  },
  submitDiagnosis: async (diagnosisData: any) => {
    // diagnosisData debe incluir: { id_cita, diagnostico, receta, ... }
    console.log(diagnosisData);
    return await api.post("/appointments/create-diagnosis", diagnosisData);
  },
  getCitaDetail: async (idCita: any) => {
    // Puedes reutilizar getMyAppointments y filtrar en el front,
    // o crear un endpoint específico GET /appointments/:id
    // Por ahora, para no hacer más backend, filtraremos en el front si ya tienes las citas cargadas,
    // pero lo ideal es un endpoint:
    return await api.get(`/appointments/${idCita}`);
  },
};

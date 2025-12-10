import { useEffect, useState } from "react";
import { doctorService } from "../../services/doctorService";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [appointments, setAppointments] = useState<any>([]);
  const [nextAppointment, setNextAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await doctorService.getMyAppointments()) as any;
        setAppointments(data);

        if (data.length > 0) {
          setNextAppointment(data[0]);
        }
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-primary font-bold animate-pulse">
        Cargando agenda...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* --- SECCIÓN 1: TARJETA PRÓXIMA CITA (Highlight) --- */}
      <div className="lg:col-span-3 bg-gradient-to-r from-primary to-secondary p-8 rounded-3xl text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="opacity-90 font-medium mb-1 uppercase tracking-wider text-sm">
            Tu próxima consulta es:
          </p>
          {nextAppointment ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 capitalize">
                {new Date(
                  nextAppointment.agenda_info.fecha + "T00:00:00"
                ).toLocaleDateString("es-MX", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h2>
              <p className="text-xl md:text-2xl opacity-90">
                A las {nextAppointment.agenda_info.hora.substring(0, 5)} hrs —
                Paciente: {nextAppointment.paciente_info.nombre}{" "}
                {nextAppointment.paciente_info.apellido}
              </p>
            </>
          ) : (
            <h2 className="text-3xl font-bold">
              No tienes citas próximas agendadas.
            </h2>
          )}
        </div>

        {nextAppointment && (
          <button
            className="bg-white text-primary px-8 py-3 rounded-full font-bold shadow-md hover:bg-gray-50 transition-colors w-full md:w-auto"
            onClick={() => {
              navigate(`/doctor/consulta/${nextAppointment.id}`);
            }}
          >
            Iniciar Consulta
          </button>
        )}
      </div>

      {/* --- SECCIÓN 2: LISTA DE AGENDA (FORMATO RESPONSIVE) --- */}
      <div className="lg:col-span-3">
        <h3 className="text-xl font-bold text-dark mb-4 pl-1">
          Agenda Completa
        </h3>

        <div className="flex flex-col gap-4">
          {appointments.length > 0 ? (
            appointments.map((cita: any) => (
              <div
                key={cita.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md"
              >
                {/* Bloque Izquierdo: Fecha y Paciente */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  {/* Fecha y Hora */}
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary font-bold rounded-lg p-2 text-center min-w-[60px]">
                      <span className="block text-xl">
                        {cita.agenda_info.hora.substring(0, 5)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {new Date(
                        cita.agenda_info.fecha + "T00:00:00"
                      ).toLocaleDateString("es-MX", { dateStyle: "medium" })}
                    </div>
                  </div>

                  {/* Nombre Paciente */}
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide md:hidden">
                      Paciente
                    </p>
                    <h4 className="text-lg font-bold text-dark">
                      {cita.paciente_info.nombre} {cita.paciente_info.apellido}
                    </h4>
                    <p className="text-xs text-gray-400 hidden md:block">
                      Expediente Digital
                    </p>
                  </div>
                </div>

                {/* Bloque Derecho: Estado y Botón */}
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-none pt-4 md:pt-0 border-gray-100">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      cita.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {cita.estado}
                  </span>

                  {cita.estado === "pendiente" && (
                    <button
                      className="text-primary font-bold hover:text-secondary hover:underline text-sm transition-colors"
                      onClick={() => {
                        navigate(
                          `/doctor/expediente/${cita.paciente_info.expediente_id}`
                        );
                      }}
                    >
                      Ver Expediente →
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 text-gray-400">
              No hay citas en la agenda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { citasService } from "../services/citasService";

const CitasPacientePage = () => {
  const [citas, setCitas] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await citasService.getMyAppointments();
        setCitas(data);
      } catch (error) {
        console.error("Error al cargar citas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary font-bold">
        Cargando tus citas...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark">Mis Citas Médicas</h1>
          <Link to="/" className="btn-outline w-auto px-6">
            + Agendar Nueva
          </Link>
        </div>

        {citas.length > 0 ? (
          <div className="space-y-4">
            {citas.map(
              (cita: {
                id: React.Key | null | undefined;
                agenda_info: { fecha: string; hora: string };
                medico_info: {
                  nombre:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  apellido:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  email:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                };
                estado:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      unknown,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
              }) => (
                <div
                  key={cita.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
                >
                  {/* 1. INFORMACIÓN DE FECHA (Lado Izquierdo) */}
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary font-bold rounded-xl p-3 text-center min-w-[80px]">
                      <span className="block text-2xl">
                        {new Date(
                          cita.agenda_info.fecha + "T00:00:00"
                        ).getDate()}
                      </span>
                      <span className="block text-xs uppercase tracking-wide">
                        {new Date(
                          cita.agenda_info.fecha + "T00:00:00"
                        ).toLocaleDateString("es-MX", { month: "short" })}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">
                        {/* 09:00:00 -> 09:00 */}
                        {cita.agenda_info.hora.substring(0, 5)} hrs
                      </p>
                      <h3 className="text-xl font-bold text-dark">
                        Dr. {cita.medico_info.nombre}{" "}
                        {cita.medico_info.apellido}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {cita.medico_info.email}
                      </p>
                    </div>
                  </div>

                  {/* 2. ESTADO Y ACCIONES (Lado Derecho) */}
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    {/* Badge de Estado */}
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${
                          cita.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-700"
                            : ""
                        }
                        ${
                          cita.estado === "finalizada"
                            ? "bg-green-100 text-green-700"
                            : ""
                        }
                        ${
                          cita.estado === "cancelada"
                            ? "bg-red-100 text-red-700"
                            : ""
                        }
                    `}
                    >
                      {cita.estado}
                    </span>

                    {/* Botón Cancelar (Solo si está pendiente) */}
                    {cita.estado === "pendiente" && (
                      <button
                        className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline"
                        onClick={() => alert("Lógica de cancelar pendiente...")}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          /* ESTADO VACÍO */
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">
              Aún no tienes citas
            </h3>
            <p className="text-gray-500 mb-8">
              Busca un especialista y reserva tu primera consulta.
            </p>
            <Link to="/" className="btn-search inline-block px-8 py-3">
              Buscar Doctor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitasPacientePage;

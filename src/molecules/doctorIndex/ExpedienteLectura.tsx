import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { doctorService } from "../../services/doctorService";

const ExpedienteLectura = () => {
  const { id } = useParams(); // Este es el ID de Mongo que pasamos en la URL
  const navigate = useNavigate();

  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        // Usamos tu nuevo servicio
        const data = await doctorService.getRecord(id);
        setExpediente(data);
      } catch (error) {
        console.error("Error cargando expediente", error);
        navigate(-1); // Regresar si falla
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExpediente();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary font-bold animate-pulse">
        Cargando expediente...
      </div>
    );
  }

  if (!expediente) return null;

  return (
    <div className="min-h-screen bg-page pb-20">
      {/* HEADER CON BOTÓN REGRESAR */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-dark">
            Expediente Clínico Digital
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* --- TARJETA DEL PACIENTE (DATOS GENERALES) --- */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
              {expediente.nombre_paciente.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-dark">
                {expediente.nombre_paciente}
              </h2>
              <p className="text-gray-400 font-medium">
                ID Mongo: {expediente._id}
              </p>
            </div>
          </div>

          {/* Datos Críticos (Sangre / Alergias) */}
          <div className="flex gap-4">
            <div className="bg-red-50 px-6 py-3 rounded-2xl border border-red-100 text-center">
              <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                Tipo Sangre
              </p>
              <p className="text-2xl font-bold text-red-600">
                {expediente.tipo_sangre}
              </p>
            </div>
            <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100">
              <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                Alergias
              </p>
              {expediente.alergias && expediente.alergias.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {expediente.alergias.map((alergia, index) => (
                    <span
                      key={index}
                      className="text-sm font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded"
                    >
                      {alergia}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-lg font-bold text-orange-600/50">Ninguna</p>
              )}
            </div>
          </div>
        </div>

        {/* --- HISTORIAL DE CONSULTAS (TIMELINE) --- */}
        <h3 className="text-2xl font-bold text-dark mb-6 pl-2 border-l-4 border-primary">
          Historial de Consultas
        </h3>

        {expediente.historial_consultas &&
        expediente.historial_consultas.length > 0 ? (
          <div className="space-y-6">
            {/* Mapeamos el array de consultas en orden inverso (más reciente primero) */}
            {[...expediente.historial_consultas]
              .reverse()
              .map((consulta, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Cabecera de la Consulta */}
                  <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                    <div>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-wide">
                        Fecha de consulta
                      </p>
                      <p className="text-lg font-bold text-dark">
                        {new Date(consulta.fecha).toLocaleDateString("es-MX", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-wide">
                        Atendido por
                      </p>
                      <p className="text-primary font-bold">
                        {consulta.nombre_doctor}
                      </p>
                    </div>
                  </div>

                  {/* Diagnóstico y Notas */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-bold text-dark mb-2">Diagnóstico</h4>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed">
                        {consulta.diagnostico}
                      </p>
                    </div>
                    {consulta.notas_adicionales && (
                      <div>
                        <h4 className="font-bold text-dark mb-2">
                          Notas Privadas
                        </h4>
                        <p className="text-gray-500 italic bg-gray-50 p-4 rounded-xl text-sm leading-relaxed border-l-4 border-gray-200">
                          "{consulta.notas_adicionales}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Receta Médica */}
                  {consulta.receta && consulta.receta.length > 0 && (
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Receta Médica
                      </h4>
                      <ul className="space-y-2">
                        {consulta.receta.map((med, i) => (
                          <li
                            key={i}
                            className="flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-white p-3 rounded-lg shadow-sm"
                          >
                            <span className="font-bold text-blue-900">
                              {med.medicamento} ({med.dosis})
                            </span>
                            <span className="text-blue-600 font-medium">
                              {med.frecuencia} durante {med.duracion}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 border-dashed">
            <p className="text-gray-400">
              Este paciente aún no tiene consultas registradas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpedienteLectura;

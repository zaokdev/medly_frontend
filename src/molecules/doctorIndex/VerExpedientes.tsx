import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { doctorService } from "../../services/doctorService";

const VerExpedientes = () => {
  const navigate = useNavigate();

  // Estados de Datos
  const [searchTerm, setSearchTerm] = useState("");
  const [patientList, setPatientList] = useState([]);

  // Estados de Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // EFECTO 1: Cuando cambia el TEXTO -> Reseteamos a página 1
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // EFECTO 2: Cuando cambia TEXTO o PÁGINA -> Buscamos
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        // Llamamos al servicio con página
        const data = await doctorService.searchPatients(searchTerm, page);

        // Backend devuelve: { pacientes: [], total_paginas: 5, ... }
        setPatientList(data.pacientes || []);
        setTotalPages(data.total_paginas || 1);
      } catch (error) {
        console.error("Error buscando pacientes", error);
        setPatientList([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]); // Se ejecuta si cambia el texto O la página

  const handleAbrirExpediente = (mongoId) => {
    if (!mongoId) {
      alert("Error: Este paciente no tiene un ID de expediente asociado.");
      return;
    }
    window.open(`/doctor/expediente/${mongoId}`);
  };

  // Funciones de Paginación
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      {/* 1. BARRA DE BÚSQUEDA */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 sticky top-24 z-10">
        <h2 className="text-xl font-bold text-dark mb-4">
          Buscador de Expedientes
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Escribe el nombre del paciente..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-dark text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* 2. ÁREA DE RESULTADOS */}
      <div className="min-h-[300px] flex flex-col justify-between">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-70">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-primary font-bold animate-pulse">Cargando...</p>
          </div>
        ) : patientList.length > 0 ? (
          <>
            {/* Lista */}
            <div className="grid gap-4 mb-8">
              {patientList.map((paciente: any) => (
                <div
                  key={paciente.id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-center gap-4 group cursor-default"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="w-14 h-14 bg-linear-to-br from-primary to-secondary rounded-2xl flex shrink-0 items-center justify-center text-white font-bold text-xl shadow-md">
                      {paciente.nombre.charAt(0)}
                      {paciente.apellido.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-dark">
                        {paciente.nombre} {paciente.apellido}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {paciente.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        ID: #{paciente.id}
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full sm:w-auto bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    onClick={() =>
                      handleAbrirExpediente(paciente.expediente_id)
                    }
                  >
                    Ver Historial
                  </button>
                </div>
              ))}
            </div>

            {/* 3. PAGINACIÓN (Solo si hay más de una página) */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-4">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                    page === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-primary hover:bg-primary/10"
                  }`}
                >
                  ← Anterior
                </button>

                <span className="text-sm font-medium text-gray-500">
                  Página <span className="text-dark font-bold">{page}</span> de{" "}
                  {totalPages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                    page === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-primary hover:bg-primary/10"
                  }`}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        ) : (
          /* Estado Vacío */
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            {/* ... tu icono y texto de estado vacío ... */}
            <h3 className="text-xl font-bold text-dark mt-4">Sin resultados</h3>
            <p className="text-gray-400">
              No encontramos pacientes que coincidan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerExpedientes;

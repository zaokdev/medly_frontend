import { useState, useEffect } from "react";
import { citasService } from "../services/citasService";
import DoctorCard from "../components/DoctorCard";
import { SPECIALTIES_LIST } from "../uiData";

const IndexPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  // Filtros
  const [searchText, setSearchText] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // Llama al backend con los filtros actuales
        const data = (await citasService.getAllDoctors(
          searchText,
          specialtyId
        )) as any;

        if (data.doctores) {
          setDoctors(data.doctores);
        }
      } catch (error) {
        console.error("Error cargando doctores", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce: Espera 500ms a que el usuario termine de escribir
    const timeoutId = setTimeout(() => {
      fetchDoctors();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, specialtyId]);

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <div className="hero-container py-12">
        <h1 className="hero-title">Encuentra a tu especialista</h1>
        <p className="hero-subtitle">Reserva citas médicas en Medly.</p>

        {/* CÁPSULA DE BÚSQUEDA */}
        <div className="search-capsule mt-6 p-1 pl-4">
          {/* Select de Especialidad */}
          <select
            className="bg-transparent text-gray-600 font-medium outline-none text-sm mr-4 cursor-pointer max-w-[150px] truncate"
            value={specialtyId}
            onChange={(e) => setSpecialtyId(e.target.value)}
          >
            <option value="">Todas las áreas</option>
            {SPECIALTIES_LIST.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nombre}
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-gray-200 mx-2"></div>

          {/* Input de Texto */}
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre (ej. House)..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <button className="btn-search">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* RESULTADOS (GRID DE DOCTORES) */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-dark mb-6">
          Doctores Disponibles
        </h2>

        {loading ? (
          <p className="text-center text-primary mt-10 animate-pulse font-medium">
            Buscando doctores...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.length > 0 ? (
              doctors.map((doc: any) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-400 text-lg">
                  No encontramos doctores con esa búsqueda.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;

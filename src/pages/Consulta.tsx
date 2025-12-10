import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { doctorService } from "../services/doctorService";

const ConsultaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados de Carga y Datos Generales
  const [cita, setCita] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- ESTADOS DEL FORMULARIO MÉDICO ---
  const [diagnostico, setDiagnostico] = useState("");
  const [notas, setNotas] = useState("");

  // Signos Vitales
  const [signos, setSignos] = useState({
    peso: "",
    altura: "",
    temperatura: "",
    presion_arterial: "",
  });

  // Receta Médica (Lista dinámica)
  const [receta, setReceta] = useState<any>([]);

  // Estado temporal para agregar un medicamento
  const [newMed, setNewMed] = useState({
    medicamento: "",
    dosis: "",
    frecuencia: "",
    duracion: "",
  });

  // 1. CARGAR DATOS DE LA CITA AL INICIAR
  useEffect(() => {
    const fetchCita = async () => {
      try {
        // Usamos el helper que creamos (o getMyAppointments filtrado)
        // Lo ideal es tener el endpoint GET /appointments/:id
        const data = await doctorService.getCitaDetail(id);
        console.log(data);
        setCita(data);
      } catch (error) {
        console.error("Error cargando cita", error);
        alert("No se pudo cargar la información de la cita.");
        navigate("/doctor/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchCita();
  }, [id, navigate]);

  // --- MANEJADORES DE LA RECETA ---
  const handleAddMedicamento = () => {
    // Validar que no esté vacío
    if (!newMed.medicamento || !newMed.dosis) {
      alert("Escribe al menos el nombre y la dosis del medicamento.");
      return;
    }
    // Agregar a la lista
    setReceta([...receta, newMed]);
    // Limpiar inputs
    setNewMed({ medicamento: "", dosis: "", frecuencia: "", duracion: "" });
  };

  const handleRemoveMedicamento = (index) => {
    const nuevaReceta = receta.filter((_, i) => i !== index);
    setReceta(nuevaReceta);
  };

  // --- ENVÍO FINAL (SUBMIT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!diagnostico.trim()) {
      alert("El diagnóstico es obligatorio para cerrar la consulta.");
      return;
    }

    if (
      !window.confirm(
        "¿Estás seguro de finalizar la consulta? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      // Armamos el payload exacto que espera tu controlador backend
      const diagnosisData = {
        id_cita: id, // ID SQL de la cita
        diagnostico: diagnostico,
        signos_vitales: signos,
        receta: receta,
        notas_adicionales: notas,
      };

      const response = await doctorService.submitDiagnosis(diagnosisData);
      console.log(response);
      alert("Consulta finalizada y expediente actualizado correctamente.");
      navigate("/doctor/dashboard"); // Volver al panel
    } catch (error) {
      console.error("Error al finalizar", error);
      alert(
        error.response?.data?.msg || "Ocurrió un error al guardar la consulta."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-primary font-bold animate-pulse">
        Cargando datos del paciente...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER FIJO */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-dark">Consulta en Curso</h1>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Cita #{id} • {new Date().toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-red-500 font-medium text-sm transition-colors"
        >
          Cancelar / Salir
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUMNA IZQUIERDA: DATOS DEL PACIENTE --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tarjeta Paciente */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                {cita?.paciente_info?.nombre.charAt(0)}
                {cita?.paciente_info?.apellido.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-dark">
                {cita?.paciente_info?.nombre} {cita?.paciente_info?.apellido}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {cita?.paciente_info?.email}
              </p>

              <div className="w-full border-t border-gray-100 pt-4 text-left">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                  Motivo (según agenda)
                </p>
                <p className="text-sm text-dark font-medium">
                  Consulta General / Seguimiento
                </p>
              </div>
            </div>
          </div>

          {/* Signos Vitales */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Signos Vitales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">
                  Peso
                </label>
                <input
                  type="text"
                  placeholder="Ej: 70kg"
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary text-sm"
                  value={signos.peso}
                  onChange={(e) =>
                    setSignos({ ...signos, peso: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">
                  Altura
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1.75m"
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary text-sm"
                  value={signos.altura}
                  onChange={(e) =>
                    setSignos({ ...signos, altura: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">
                  Temp.
                </label>
                <input
                  type="text"
                  placeholder="Ej: 36.5°C"
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary text-sm"
                  value={signos.temperatura}
                  onChange={(e) =>
                    setSignos({ ...signos, temperatura: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">
                  Presión
                </label>
                <input
                  type="text"
                  placeholder="Ej: 120/80"
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary text-sm"
                  value={signos.presion_arterial}
                  onChange={(e) =>
                    setSignos({ ...signos, presion_arterial: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO MÉDICO --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Diagnóstico */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-dark mb-4 text-lg">
              Diagnóstico Médico
            </h3>
            <textarea
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all min-h-[120px] text-dark"
              placeholder="Escribe el diagnóstico detallado aquí..."
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
            ></textarea>
          </div>

          {/* 2. Receta Médica (Dinámica) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-dark mb-4 text-lg flex justify-between items-center">
              Receta Médica
              <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                {receta.length} medicamentos
              </span>
            </h3>

            {/* Formulario para agregar medicamento */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Medicamento (Ej: Paracetamol)"
                  className="p-2 rounded-lg border border-gray-200 text-sm w-full"
                  value={newMed.medicamento}
                  onChange={(e) =>
                    setNewMed({ ...newMed, medicamento: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Dosis (Ej: 500mg)"
                  className="p-2 rounded-lg border border-gray-200 text-sm w-full"
                  value={newMed.dosis}
                  onChange={(e) =>
                    setNewMed({ ...newMed, dosis: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Frecuencia (Ej: Cada 8 hrs)"
                  className="p-2 rounded-lg border border-gray-200 text-sm w-full"
                  value={newMed.frecuencia}
                  onChange={(e) =>
                    setNewMed({ ...newMed, frecuencia: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Duración (Ej: 5 días)"
                  className="p-2 rounded-lg border border-gray-200 text-sm w-full"
                  value={newMed.duracion}
                  onChange={(e) =>
                    setNewMed({ ...newMed, duracion: e.target.value })
                  }
                />
              </div>
              <button
                type="button"
                onClick={handleAddMedicamento}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm"
              >
                + Agregar a la Receta
              </button>
            </div>

            {/* Lista de medicamentos agregados */}
            {receta.length > 0 ? (
              <ul className="space-y-2">
                {receta.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <div>
                      <p className="font-bold text-dark text-sm">
                        {item.medicamento}{" "}
                        <span className="font-normal text-gray-500">
                          - {item.dosis}
                        </span>
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        {item.frecuencia} durante {item.duracion}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveMedicamento(index)}
                      className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400 text-sm italic py-4">
                No hay medicamentos agregados aún.
              </p>
            )}
          </div>

          {/* 3. Notas Privadas */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-dark mb-2 text-lg">
              Notas Adicionales (Privado)
            </h3>
            <textarea
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-primary text-dark text-sm min-h-[80px]"
              placeholder="Observaciones internas solo visibles para médicos..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      {/* FOOTER FLOTANTE PARA GUARDAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-30">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">
              Asegúrate de revisar la receta antes de finalizar.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`
                    px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 w-full md:w-auto
                    ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-secondary"
                    }
                `}
          >
            {submitting ? "Guardando..." : "Finalizar Consulta y Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultaPage;

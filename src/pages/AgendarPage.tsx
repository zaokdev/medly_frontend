import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { citasService } from "../services/citasService";
import { useAuth } from "../contexts/AuthContext";
import type { Usuario } from "../uiData";

const AgendarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados
  const [doctor, setDoctor] = useState<Usuario | null>(null);
  const [groupedSlots, setGroupedSlots] = useState({});
  const [availableDates, setAvailableDates] = useState<any>([]);

  // Selección del usuario
  const [selectedDate, setSelectedDate] = useState<any>("");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false); // Para el botón de reservar

  useEffect(() => {
    if (!id) return navigate("/");

    const fetchSchedule = async () => {
      try {
        const data = (await citasService.getDoctorSchedule(id)) as any;

        // 1. Guardar Info Doctor
        if (data.info_doctor) {
          setDoctor(data.info_doctor);
        }

        // 2. Procesar Horarios (Agrupar por fecha)
        if (data.schedule && data.schedule.length > 0) {
          // Reducimos el array plano a un objeto agrupado por fecha
          const groups = data.schedule.reduce((acc: any, slot: any) => {
            const dateKey = slot.fecha; // "2025-12-15"
            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }
            acc[dateKey].push(slot);
            return acc;
          }, {});

          setGroupedSlots(groups);

          // Extraemos las fechas disponibles y seleccionamos la primera por defecto
          const dates = Object.keys(groups).sort();
          setAvailableDates(dates);
          if (dates.length > 0) setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error("Error cargando agenda", error);
        alert("No pudimos cargar la agenda de este médico.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id, navigate]);

  // Función para manejar la reserva
  // Función para manejar la reserva
  const handleBooking = async () => {
    if (!user) {
      alert("Debes iniciar sesión para reservar.");
      return navigate("/login");
    }

    if (!selectedSlot || !doctor) return;

    // Confirmación visual
    const confirm = window.confirm(
      `¿Confirmar cita con Dr. ${doctor.apellido} el ${selectedSlot.fecha} a las ${selectedSlot.hora}?`
    );
    if (!confirm) return;

    setProcessing(true);
    try {
      // CORRECCIÓN: Enviamos solo el ID único del horario (agenda)
      // selectedSlot es el objeto del array 'schedule', que ya trae el 'id' (ej: 15)
      await citasService.bookSchedule(selectedSlot.id);

      alert("¡Cita reservada con éxito!");
      navigate("/paciente/mis-citas");
    } catch (error: any) {
      // Si el backend responde error (ej: 409 Conflict), mostramos el mensaje
      alert(
        error.msg || "Error al reservar la cita. Intenta con otro horario."
      );

      // Recargamos para que se actualicen los horarios ocupados
      window.location.reload();
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-primary font-bold">
        Cargando agenda...
      </div>
    );

  return (
    <div className="min-h-screen bg-page pb-20">
      {/* HEADER / BACK BUTTON */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
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
          <h1 className="text-lg font-bold text-dark">Agendar Cita</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* 1. TARJETA DEL DOCTOR */}
        {doctor && (
          <div className="bg-card p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 mb-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold border-2 border-white shadow-sm">
              {doctor.nombre?.charAt(0)}
              {doctor.apellido?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark">
                Dr. {doctor.nombre} {doctor.apellido}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{doctor.email}</p>
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wide">
                Disponible
              </div>
            </div>
          </div>
        )}

        {/* 2. SELECTOR DE FECHAS (TABS) */}
        {availableDates.length > 0 ? (
          <>
            <h3 className="text-dark font-bold mb-4 ml-1">
              Selecciona una fecha
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
              {availableDates.map((date: any) => (
                <button
                  key={date}
                  onClick={() => {
                    console.log(date);
                    setSelectedDate(date);
                    setSelectedSlot(null); // Reset slot al cambiar fecha
                  }}
                  className={`
                                flex-shrink-0 px-6 py-3 rounded-2xl border transition-all duration-200
                                ${
                                  selectedDate === date
                                    ? "bg-primary text-white border-primary shadow-md transform scale-105"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                                }
                            `}
                >
                  {/* Formato bonito de fecha (ej: Lun 15 Dic) */}
                  <span className="font-bold block">
                    {new Date(date + "T00:00:00").toLocaleDateString("es-MX", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </div>

            {/* 3. GRILLA DE HORARIOS */}
            <h3 className="text-dark font-bold mb-4 ml-1">
              Horarios disponibles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
              {groupedSlots[selectedDate]?.map((slot: any) => (
                <button
                  key={slot.id} // Usamos el ID del schedule como key
                  onClick={() => setSelectedSlot(slot)}
                  className={`
                                py-3 px-4 rounded-xl border font-medium transition-all duration-200 text-center
                                ${
                                  selectedSlot?.id === slot.id
                                    ? "bg-secondary text-white border-secondary ring-2 ring-secondary/20 shadow-md"
                                    : "bg-white text-dark border-gray-200 hover:border-secondary hover:text-secondary"
                                }
                            `}
                >
                  {/* Cortamos los segundos: 09:00:00 -> 09:00 */}
                  {slot.hora.substring(0, 5)}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400">
              No hay horarios disponibles próximamente para este doctor.
            </p>
          </div>
        )}
      </div>

      {/* 4. BOTÓN FLOTANTE DE CONFIRMACIÓN */}
      {selectedSlot && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg animate-[fadeIn_0.3s_ease-out]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reservar turno para el</p>
              <p className="font-bold text-dark text-lg">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "es-MX",
                  { day: "numeric", month: "long" }
                )}{" "}
                a las {selectedSlot.hora.substring(0, 5)}
              </p>
            </div>
            <button
              onClick={handleBooking}
              disabled={processing}
              className={`
                        bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg 
                        hover:bg-secondary transition-all transform hover:-translate-y-1
                        ${processing ? "opacity-50 cursor-not-allowed" : ""}
                    `}
            >
              {processing ? "Reservando..." : "Confirmar Cita"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendarPage;

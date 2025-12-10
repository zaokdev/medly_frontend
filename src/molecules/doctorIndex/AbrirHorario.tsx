import React, { useState } from "react";
import { doctorService } from "../../services/doctorService";

const AbrirHorario = () => {
  const [scheduleDate, setScheduleDate] = useState("");
  const [startHour, setStartHour] = useState("09:00");
  const [endHour, setEndHour] = useState("14:00");

  const handleOpenSchedule = async (e: any) => {
    e.preventDefault();
    try {
      const slots: any = [];
      let current = parseInt(startHour.split(":")[0]);
      const end = parseInt(endHour.split(":")[0]);

      while (current < end) {
        slots.push({
          fecha: scheduleDate,
          hora: `${current.toString().padStart(2, "0")}:00:00`,
        });
        current++;
      }

      await doctorService.openSchedule(slots);
      alert(
        `¡Éxito! Se abrieron ${slots.length} horarios para el ${scheduleDate}`
      );
      setScheduleDate("");
    } catch (error) {
      alert("Error al abrir horarios");
    }
  };
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-[fadeIn_0.3s_ease-out]">
      <h2 className="text-2xl font-bold text-dark mb-2">
        Generar Disponibilidad
      </h2>
      <p className="text-gray-500 mb-6">
        El sistema generará bloques de 1 hora automáticamente.
      </p>

      <form onSubmit={handleOpenSchedule}>
        <div className="mb-4">
          <label className="block text-sm font-bold text-dark mb-2">
            Fecha
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-primary"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-dark mb-2">
              Desde (Hora)
            </label>
            <input
              type="time"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-dark mb-2">
              Hasta (Hora)
            </label>
            <input
              type="time"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-md hover:bg-secondary transition-colors"
        >
          Abrir Horarios
        </button>
      </form>
    </div>
  );
};

export default AbrirHorario;

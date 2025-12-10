import React from "react";
import { useNavigate } from "react-router";

const DoctorCard = ({ doctor }: any) => {
  // Tu JSON trae un array de objetos: [{nombre: 'Cardio'}, {nombre: 'Pedia'}]
  // Esto lo convierte en un string lindo: "Cardiología, Pediatría"
  const especialidadesTexto = doctor.especialidades_del_medico
    .map((esp: any) => esp.nombre)
    .join(", ");
  const navigate = useNavigate();

  return (
    <div className="doctor-card group">
      {/* Avatar (Placeholder con iniciales) */}
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
        {doctor.nombre.charAt(0)}
        {doctor.apellido.charAt(0)}
      </div>

      <h3 className="doctor-name">
        Dr. {doctor.nombre} {doctor.apellido}
      </h3>

      {/* Mostramos las especialidades procesadas */}
      <p className="doctor-specialty">
        {especialidadesTexto || "Médico General"}
      </p>

      <button
        className="btn-outline mt-2 w-full cursor-pointer"
        onClick={() => {
          navigate(`/agendar-cita/${doctor.id}`);
        }}
      >
        Ver Agenda
      </button>
    </div>
  );
};

export default DoctorCard;

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthWrapper from "../layouts/AuthWrapper";
import Dashboard from "../molecules/doctorIndex/Dashboard";
import AbrirHorario from "../molecules/doctorIndex/AbrirHorario";
import VerExpedientes from "../molecules/doctorIndex/VerExpedientes";

const DoctorDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    // 2. ENVUELVE TODO EL CONTENIDO AQUÍ
    <AuthWrapper id_rol={2}>
      <div className="min-h-screen bg-page pb-20">
        {/* HEADER */}
        <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-dark hidden md:block">
              Panel Médico{" "}
              <span className="text-gray-400 font-normal">
                | Dr. {user?.nombre_completo?.split(" ")[0]}
              </span>
            </h1>

            {/* TABS NAVEGACIÓN */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-dark"
                }`}
              >
                Mis Citas
              </button>
              <button
                onClick={() => setActiveTab("agenda")}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                  activeTab === "agenda"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-dark"
                }`}
              >
                Abrir Horarios
              </button>
              <button
                onClick={() => setActiveTab("pacientes")}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                  activeTab === "pacientes"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-dark"
                }`}
              >
                Expedientes
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* VISTA 1: DASHBOARD (CITAS) */}
          {activeTab === "dashboard" && <Dashboard />}

          {/*  VISTA 2: ABRIR HORARIOS  */}
          {activeTab === "agenda" && <AbrirHorario />}

          {/*  VISTA 3: EXPEDIENTES (Placeholder)  */}
          {activeTab === "pacientes" && <VerExpedientes />}
        </div>
      </div>
    </AuthWrapper>
  );
};

export default DoctorDashboard;

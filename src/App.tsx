import { Route, Routes } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import LoginPage from "./pages/LoginPage";
import IndexPage from "./pages/IndexPage";
import AgendarPage from "./pages/AgendarPage";
import CitasPacientePage from "./pages/CitasPacientePage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import ExpedienteLectura from "./molecules/doctorIndex/ExpedienteLectura";
import AuthWrapper from "./layouts/AuthWrapper";
import ConsultaPage from "./pages/Consulta";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route element={<IndexPage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/registro" />
        <Route element={<AgendarPage />} path="/agendar-cita/:id" />
        <Route element={<CitasPacientePage />} path="/paciente/mis-citas" />
        <Route element={<DoctorDashboardPage />} path="/doctor/dashboard" />
        <Route
          element={
            <AuthWrapper id_rol={2}>
              <ExpedienteLectura />
            </AuthWrapper>
          }
          path="/doctor/expediente/:id"
        />
      </Route>
      <Route
        path="/doctor/consulta/:id"
        element={
          <AuthWrapper id_rol={2}>
            <ConsultaPage />
          </AuthWrapper>
        }
      ></Route>
    </Routes>
  );
}

export default App;

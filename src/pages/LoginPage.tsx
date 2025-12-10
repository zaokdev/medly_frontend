import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = (await login(formData.email, formData.password)) as any;
      console.log(response.id_rol, response.id_rol == 2);
      if (response.id_rol == 2) {
        navigate("/doctor/dashboard");
        return;
      } else {
        navigate("/");
        return;
      }
    } catch (err: any) {
      alert(err.message || "Error al iniciar sesion");
      console.log(err.message || "Error al iniciar sesion");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Encabezado del Formulario */}
        <div className="flex flex-col items-center mb-6">
          {/* Logo Pequeño decorativo */}
          <div className="bg-primary/10 p-3 rounded-full mb-4 text-primary">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="auth-title">Bienvenido de nuevo</h2>
          <p className="auth-subtitle">
            Ingresa tus credenciales para acceder a Medly
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ejemplo@correo.com"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="form-label mb-0">
                Contraseña
              </label>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Botón Submit */}
          <button type="submit" className="btn-primary-full">
            Iniciar Sesión
          </button>
        </form>

        {/* Footer del Formulario (Redirección al Registro) */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          ¿Aún no tienes una cuenta?{" "}
          <Link to="/registro" className="auth-link">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

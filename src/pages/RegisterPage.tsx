import { useState } from "react";
import { Link, useNavigate } from "react-router"; // Nota: usa 'react-router-dom'
import { authService } from "../services/authService"; // Usamos el servicio directo

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    tipo_sangre: "O+", // Valor por defecto seguro
    alergiasInput: "", // Campo de texto para el usuario
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Preparar los datos para el Backend
      // Convertimos el string de alergias en un array
      const alergiasArray = formData.alergiasInput
        ? formData.alergiasInput.split(",").map((item) => item.trim())
        : [];

      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        tipo_sangre: formData.tipo_sangre,
        alergias: alergiasArray,
      };

      // 2. Enviar al Backend
      await authService.register(payload);

      // 3. Éxito
      alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.mensaje || err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card max-w-lg">
        {" "}
        {/* max-w-lg para que sea un poco más ancho */}
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-6">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="auth-title">Crear Cuenta</h2>
          <p className="auth-subtitle">Únete a Medly para gestionar tu salud</p>
        </div>
        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Nombre y Apellido (En una fila) */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Juan"
                className="form-input"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Apellido</label>
              <input
                type="text"
                name="apellido"
                placeholder="Pérez"
                className="form-input"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="juan.perez@ejemplo.com"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Datos Médicos (Sangre y Alergias) */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-1">
              <label className="form-label">Tipo Sangre</label>
              <select
                name="tipo_sangre"
                className="form-input h-[50px]" // Ajuste de altura para alinear
                value={formData.tipo_sangre}
                onChange={handleChange}
              >
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="col-span-2">
              <label className="form-label">
                Alergias{" "}
                <span className="font-normal text-gray-400 text-xs">
                  (Separa con comas)
                </span>
              </label>
              <input
                type="text"
                name="alergiasInput"
                placeholder="Polen, Penicilina, Maní..."
                className="form-input"
                value={formData.alergiasInput}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className={`btn-primary-full ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="auth-link">
            Inicia Sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

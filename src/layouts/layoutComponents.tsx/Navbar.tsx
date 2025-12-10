import { useEffect, useState } from "react";
import { Link } from "react-router"; // Asumiendo que usas React Router
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  console.log(user);

  // Función para abrir/cerrar menú
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleMenuAndLogout = async () => {
    toggleMenu();
    await logout();

    try {
    } catch (error: any) {
      alert(error.message || "Ha ocurrido un error");
    }
  };

  return (
    <nav className="navbar-root">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* 1. LOGO */}
          <Link to="/" className="nav-logo">
            {/* Icono SVG simple de cruz médica */}
            <svg
              className="w-8 h-8 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Medly
          </Link>

          {/* 2. MENÚ ESCRITORIO (Hidden en móvil) */}
          <div className="nav-desktop-menu">
            {/* Separador vertical */}
            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {!user ? (
              <>
                <Link to="/login" className="nav-btn-login">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="nav-btn-register">
                  Registrarme
                </Link>
              </>
            ) : (
              <>
                <Link to={"/paciente/mis-citas"} className="nav-btn-login">
                  Mis citas
                </Link>
                <Link
                  to={"/"}
                  className="nav-btn-register"
                  onClick={toggleMenuAndLogout}
                >
                  Cerrar sesión
                </Link>{" "}
              </>
            )}
          </div>

          {/* 3. BOTÓN HAMBURGUESA (Visible solo en móvil) */}
          <button onClick={toggleMenu} className="nav-hamburger-btn">
            {isOpen ? (
              // Icono X (Cerrar)
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Icono Hamburguesa (Abrir)
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 4. MENÚ DESPLEGABLE MÓVIL (Condicional) */}
      {isOpen && (
        <div className="nav-mobile-dropdown">
          <Link
            to="/doctores"
            className="nav-link text-lg"
            onClick={toggleMenu}
          >
            Buscar Doctores
          </Link>
          <Link
            to="/especialidades"
            className="nav-link text-lg"
            onClick={toggleMenu}
          >
            Especialidades
          </Link>
          <hr className="border-gray-100 my-2" />
          {!user ? (
            <>
              <Link
                to="/login"
                className="nav-btn-login text-center border border-gray-200 rounded-full"
                onClick={toggleMenu}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                className="nav-btn-register text-center"
                onClick={toggleMenu}
              >
                Crear Cuenta Gratis
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/paciente/mis-citas"
                className="nav-btn-login text-center border border-gray-200 rounded-full"
                onClick={toggleMenu}
              >
                Mis citas
              </Link>
              <Link
                to="/"
                className="nav-btn-register text-center"
                onClick={toggleMenuAndLogout}
              >
                Cerrar sesión
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

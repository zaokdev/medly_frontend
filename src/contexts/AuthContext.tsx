import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";
import type { Usuario } from "../uiData";
// 1. DEFINIMOS LA INTERFAZ DEL USUARIO
// Esto debe coincidir con lo que tu backend guarda en req.session.user

// 2. DEFINIMOS QUÉ DATOS Y FUNCIONES EXPORTA EL CONTEXTO
interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface LoginResponse {
  mensaje: string;
  usuario: Usuario; // Reutiliza la interfaz User que ya definiste arriba
}
// Creamos el contexto inicializado como undefined (para forzar el uso dentro del Provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. EL COMPONENTE PROVIDER
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // --- EFECTO DE INICIO (Verificar Cookie) ---
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Llama a /me. La cookie viaja sola gracias a withCredentials: true
        const response = (await authService.checkSession()) as any;

        // Tu backend devuelve: { mensaje: "...", usuario: { id... } }
        if (response.usuario) {
          setUser(response.usuario);
        }
      } catch (error) {
        // Si es 401 o falla, no hay usuario
        console.log("No hay sesión activa");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // --- FUNCIÓN LOGIN ---
  const login = async (email: string, password: string) => {
    try {
      const response = (await authService.login(
        email,
        password
      )) as unknown as LoginResponse;

      // Actualizamos el estado con los datos que devolvió el login
      if (response.usuario) {
        setUser(response.usuario);
      }

      return response.usuario;
    } catch (error) {
      throw error; // Re-lanzamos para que el componente Login maneje la UI de error
    }
  };

  // --- FUNCIÓN LOGOUT ---
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        // Loader minimalista usando tus colores
        <div className="h-screen flex items-center justify-center bg-page text-primary font-bold text-xl animate-pulse">
          Cargando Medly...
        </div>
      )}
    </AuthContext.Provider>
  );
};

// 4. CUSTOM HOOK (Para usar el contexto fácil y seguro)
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

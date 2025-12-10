import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

type AuthWrapperType = {
  children: React.ReactNode;
  id_rol: number;
};

const AuthWrapper = ({ children, id_rol }: AuthWrapperType) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (!user || user.id_rol != id_rol) {
      console.log("Regresando al '/',acceso denegado.");
      navigate("/");
      return;
    }
  }, []);
  return <>{children}</>;
};

export default AuthWrapper;

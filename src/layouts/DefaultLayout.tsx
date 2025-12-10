import React from "react";
import Navbar from "./layoutComponents.tsx/Navbar";
import { Outlet } from "react-router";

const DefaultLayout = () => {
  return (
    <div className="min-h-screen bg-page flex flex-col">
      {" "}
      {/* bg-page usa tu variable --color3 */}
      {/* Navbar pegajoso o normal */}
      <Navbar />
      {/* CONTENEDOR PRINCIPAL */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
};

export default DefaultLayout;

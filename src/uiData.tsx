// Lista de especialidades estática (Hardcoded)
export const SPECIALTIES_LIST = [
  { id: 2, nombre: "Cardiología" },
  { id: 4, nombre: "Dermatología" },
  { id: 11, nombre: "Gastroenterología" },
  { id: 5, nombre: "Ginecología y Obstetricia" },
  { id: 1, nombre: "Medicina General" },
  { id: 13, nombre: "Nefrología" },
  { id: 12, nombre: "Neumología" },
  { id: 7, nombre: "Neurología" },
  { id: 8, nombre: "Oftalmología" },
  { id: 10, nombre: "Otorrinolaringología" },
  { id: 3, nombre: "Pediatría" },
  { id: 9, nombre: "Psiquiatría" },
  { id: 6, nombre: "Traumatología y Ortopedia" },
];

export type Usuario = {
  id: any;
  nombre_completo?: string;
  nombre?: string;
  apellido?: string;
  id_rol: number | string;
};

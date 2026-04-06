import { supabase } from "@/supabase/supabase";
import dayjs from "dayjs";

export interface RegistroTypeDB {
  id?: string;
  titulo: string;
  valor: number;
  tipo: "Ingreso" | "Egreso";
  etiquetas: string[];
  created_at?: string;
}

export const createRegister = async (registro: RegistroTypeDB) => {
  const response = await supabase
    .from("Registro")
    .insert({ ...registro, created_at: dayjs().format("YYYY-MM-DD HH:mm:ss") });
  return response;
};

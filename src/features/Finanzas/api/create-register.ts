import { supabase } from "@/supabase/supabase";

export interface RegistroTypeDB {
  id?: string;
  titulo: string;
  valor: number;
  tipo: "Ingreso" | "Egreso";
  etiquetas: string[];
  created_at?: string;
}

export const createRegister = async (registro: RegistroTypeDB) => {
  const response = await supabase.from("Registro").insert(registro);
  return response;
};

import { supabase } from "@/supabase/supabase";

export interface RegistroTypeDB {
  id?: string;
  titulo: string;
  valor: number;
  tipo: "Ingreso" | "Egreso";
  etiquetas: string[];
  created_at?: string;
  user_fk?: string;
}

export const createRegister = async (registro: RegistroTypeDB) => {
  const response = await supabase.from("Registro").insert(registro);
  console.log(response);
  return response;
};

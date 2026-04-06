import { supabase } from "@/supabase/supabase";
import type { RegistroTypeDB } from "./create-register";

export const updateRegister = async (registro: RegistroTypeDB) => {
  console.log(registro);
  const response = await supabase
    .from("Registro")
    .update(registro)
    .eq("id", registro.id);

  return response;
};

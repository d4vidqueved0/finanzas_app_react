import { supabase } from "@/supabase/supabase";

export const getRegisterPeriod = async (
  fechaInicio: string,
  fechaFin: string,
) => {
  const response = await supabase
    .from("Registro")
    .select("*")
    .gte("created_at", fechaInicio)
    .lt("created_at", fechaFin);

  return response;
};

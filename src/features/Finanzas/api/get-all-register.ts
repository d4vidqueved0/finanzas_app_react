import { supabase } from "@/supabase/supabase";

export const getAllRegister = async () => {
  const response = await supabase.from("Registro").select("*");
  console.log(response);
  return response;
};

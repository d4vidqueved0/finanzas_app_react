import { supabase } from "@/supabase/supabase";

export const deleteManyRegister = async (array: string[]) => {
  const response = await supabase.from("Registro").delete().in("id", array);
  return response;
};

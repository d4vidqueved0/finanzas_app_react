import { supabase } from "@/supabase/supabase";

export const deleteRegister = async (id: string) => {
  const response = await supabase.from("Registro").delete().eq("id", id);
  return response;
};

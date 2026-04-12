import { supabase } from "@/supabase/supabase";

export const signUp = async (email: string, password: string) => {
  const response = await supabase.auth.signUp({ email, password });
  return response;
};

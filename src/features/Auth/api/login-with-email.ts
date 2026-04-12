import { supabase } from "@/supabase/supabase";

export const loginWithEmail = async (email: string, password: string) => {
  const response = await supabase.auth.signInWithPassword({ email, password });

  console.log(response);
};

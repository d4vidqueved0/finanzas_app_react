import { supabase } from "@/supabase/supabase";

export const signOut = () => {
  supabase.auth.signOut();
};

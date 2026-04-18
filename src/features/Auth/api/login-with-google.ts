import { supabase } from "@/supabase/supabase";

export const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/finanzas`,
    },
  });
};

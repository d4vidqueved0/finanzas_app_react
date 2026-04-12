import { supabase } from "@/supabase/supabase";

export const loginWithGoogle = () => {
  console.log(window.location.origin);
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/login`,
    },
  });
};

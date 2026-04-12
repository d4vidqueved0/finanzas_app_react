import { useAuthStore } from "@/features/Auth/store/useAuthStore";
import { supabase } from "@/supabase/supabase";
import { useEffect, type ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setSession } = useAuthStore();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((ev, session) => {
      console.log(ev, session);
      if (ev === "INITIAL_SESSION" || ev === "SIGNED_IN") {
        if (session?.user) {
          setSession(session.user);
        }
      }
      if (ev === "SIGNED_OUT") {
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);

  return children;
}

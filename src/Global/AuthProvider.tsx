import { useAuthStore } from "@/features/Auth/store/useAuthStore";
import { supabase } from "@/supabase/supabase";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setSession } = useAuthStore();

  useEffect(() => {
    let mount = true;

    const initialSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(data.session);
      if (mount) setSession(data.session);
    };

    initialSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((ev, session) => {
      if (ev === "SIGNED_IN") {
        setSession(session);
      }
      if (ev === "SIGNED_OUT") {
        setSession(null);
        toast.info("Se cerró la sesión.");
      }
    });

    return () => {
      mount = false;
      subscription.unsubscribe();
    };
  }, [setSession]);

  return children;
}

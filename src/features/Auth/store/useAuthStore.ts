import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthStoreProps {
  session: Session | null | undefined;
  setSession: (session: Session | null | undefined) => void;
}

export const useAuthStore = create<AuthStoreProps>((set) => {
  return {
    session: undefined,
    setSession: (session) =>
      set(() => {
        return {
          session,
        };
      }),
  };
});

import type { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthStoreProps {
  session: User | null;
  setSession: (session: User | null) => void;
}

export const useAuthStore = create<AuthStoreProps>((set) => {
  return {
    session: null,
    setSession: (session) =>
      set(() => {
        return {
          session,
        };
      }),
  };
});

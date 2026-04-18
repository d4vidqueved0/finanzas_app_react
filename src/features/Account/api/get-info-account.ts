import { supabase } from "@/supabase/supabase";

type Account = {
  id: string;
  nombre: string;
  foto_url: string;
  created_at: string;
};

export const getInfoAccount = async () => {
  const { data } = await supabase.from("Usuario").select("*");
  const [newData]: Account[] = data || [];
  console.log(newData);
  return newData;
};

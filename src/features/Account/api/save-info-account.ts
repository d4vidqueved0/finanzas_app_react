import { supabase } from "@/supabase/supabase";

export const saveInfoAccount = async (newInfo: {
  nombre?: string;
  imagen?: string;
  id: string;
}) => {
  const response = await supabase
    .from("Usuario")
    .update({
      nombre: newInfo.nombre,
      foto_url: newInfo.imagen,
    })
    .eq("id", newInfo.id);

  console.log(response);
};

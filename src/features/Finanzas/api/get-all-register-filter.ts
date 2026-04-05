import { supabase } from "@/supabase/supabase";

interface Filters {
  buscar: string;
  tipo: string;
}

export const getAllRegisterFilters = async (filters: Filters) => {
  console.log(filters);
  let query = supabase
    .from("Registro")
    .select("*")
    .ilike("titulo", `%${filters.buscar}%`);

  if (filters.tipo && filters.tipo !== "Todos" && filters.tipo !== "") {
    query = query.eq("tipo", filters.tipo);
  }
  const response = await query;
  return response;
};

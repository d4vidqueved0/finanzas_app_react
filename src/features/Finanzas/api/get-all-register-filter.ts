import { supabase } from "@/supabase/supabase";

interface Filters {
  buscar: string;
  tipo: string;
  created_at: string;
  etiqueta: string;
}

export const getAllRegisterFilters = async (filters: Filters) => {
  console.log(`${filters.created_at}T00:00:00Z`);
  let query = supabase
    .from("Registro")
    .select("*")
    .ilike("titulo", `%${filters.buscar}%`)
    .gte("created_at", `${filters.created_at}T00:00:00`)
    .lte("created_at", `${filters.created_at}T23:59:59`);

  if (filters.tipo && filters.tipo !== "Todos" && filters.tipo !== "") {
    query = query.eq("tipo", filters.tipo);
  }

  if (filters.etiqueta && filters.etiqueta !== "") {
    query = query.contains("etiquetas", [filters.etiqueta]);
  }
  const response = await query;
  return response;
};

import { supabase } from "@/supabase/supabase";

interface Filters {
  search: string;
  type: string;
  created_at: string;
  tag: string;
}

export const getAllRegisterFilters = async (filters: Filters) => {
  console.log(`${filters.created_at}T00:00:00Z`);
  let query = supabase
    .from("Registro")
    .select("*")
    .ilike("titulo", `%${filters.search}%`);

  if (filters.created_at !== "Todas las fechas" && filters.created_at !== "")
    query = query
      .gte("created_at", `${filters.created_at}T00:00:00`)
      .lte("created_at", `${filters.created_at}T23:59:59`);

  if (filters.type && filters.type !== "Todos" && filters.type !== "") {
    query = query.eq("tipo", filters.type);
  }

  if (filters.tag && filters.tag!== "") {
    query = query.contains("etiquetas", [filters.tag]);
  }
  const response = await query;
  return response.data;
};

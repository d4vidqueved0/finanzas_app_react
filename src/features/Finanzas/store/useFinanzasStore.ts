import dayjs from "dayjs";
import { create } from "zustand";

interface useFinanzasInterface {
  currentDate: string;
  filters: {
    search: string;
    type: string;
    created_at: string;
    tag: string;
  };
  addDay: () => void;
  reduceDay: () => void;
  handleSearch: (search: string) => void;
  handleType: (type: string) => void;
  handleTag: (tag: string) => void;
  clearFilters: () => void;
}

export const useFinanzasStore = create<useFinanzasInterface>((set) => {
  const currentDate = dayjs().format("YYYY-MM-DD");
  return {
    currentDate,
    filters: {
      search: "",
      type: "",
      created_at: currentDate,
      tag: "",
    },
    addDay: () =>
      set((state) => {
        const newDay =
          state.filters.created_at === "Todas la fechas"
            ? currentDate
            : state.filters.created_at;
        return {
          filters: {
            ...state.filters,
            created_at: dayjs(newDay).add(1, "day").format("YYYY-MM-DD"),
          },
        };
      }),
    reduceDay: () =>
      set((state) => {
        const newDay =
          state.filters.created_at === "Todas la fechas"
            ? currentDate
            : state.filters.created_at;
        return {
          filters: {
            ...state.filters,
            created_at: dayjs(newDay).subtract(1, "day").format("YYYY-MM-DD"),
          },
        };
      }),
    handleSearch: (search: string) =>
      set((state) => {
        return {
          filters: {
            ...state.filters,
            created_at: search === "" ? currentDate : "Todas las fechas",
            buscar: search,
            etiqueta: "",
          },
        };
      }),
    handleType: (type: string) =>
      set((state) => {
        return {
          filters: {
            ...state.filters,
            type,
            created_at: "Todas las fechas",
          },
        };
      }),
    handleTag: (tag: string) =>
      set((state) => {
        return {
          filters: {
            ...state.filters,
            tag: tag === state.filters.tag ? "" : tag,
            created_at:
              tag === state.filters.tag ? currentDate : "Todas las fechas",
          },
        };
      }),
    clearFilters: () =>
      set(() => {
        return {
          filters: {
            search: "",
            type: "",
            created_at: currentDate,
            tag: "",
          },
        };
      }),
  };
});

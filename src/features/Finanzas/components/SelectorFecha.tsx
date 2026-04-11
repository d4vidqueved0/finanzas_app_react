import { Button } from "@/components";
import { formatearFecha } from "@/utils/formatearFecha";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFinanzasStore } from "../store/useFinanzasStore";

export function SelectorFecha() {
  const { filters, addDay, reduceDay } = useFinanzasStore();
  return (
    <section className="w-full flex items-center justify-between mb-3">
      <Button onClick={reduceDay}>
        <ArrowLeft />
      </Button>
      <span>
        {filters.created_at === "Todas las fechas"
          ? "Todas las fechas"
          : formatearFecha(filters.created_at)}
      </span>
      <Button onClick={addDay}>
        <ArrowRight />
      </Button>
    </section>
  );
}

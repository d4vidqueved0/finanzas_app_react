import { Button } from "@/components";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "react-day-picker/locale";

import { formatearFecha } from "@/utils/formatearFecha";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight, CalendarIcon } from "lucide-react";
import { useFinanzasStore } from "../store/useFinanzasStore";

export function SelectorFecha() {
  const { filters, addDay, reduceDay, handleDate } = useFinanzasStore();
  return (
    <section className="w-full flex items-center justify-between mb-3">
      <Button onClick={reduceDay}>
        <ArrowLeft />
      </Button>
      {/* <span>
        {filters.created_at === "Todas las fechas"
          ? "Todas las fechas"
          : formatearFecha(filters.created_at)}
      </span> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!filters.created_at}
            className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground w-fit"
          >
            <CalendarIcon />
            {filters.created_at && filters.created_at !== "Todas las fechas" ? (
              formatearFecha(dayjs(filters.created_at).format("YYYY-MM-DD"))
            ) : (
              <span>Todas las fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-black/30 backdrop-blur-xl">
          <Calendar
            locale={es}
            mode="single"
            selected={dayjs(filters.created_at).toDate()}
            onSelect={(date) => {
              if (date) handleDate(date);
            }}
          />
        </PopoverContent>
      </Popover>
      <Button onClick={addDay}>
        <ArrowRight />
      </Button>
    </section>
  );
}

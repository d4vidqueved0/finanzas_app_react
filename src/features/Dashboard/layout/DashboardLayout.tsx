import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import type { RegistroTypeDB } from "@/features/Finanzas/api/create-register";
import { formatearDinero } from "@/utils/formatearDInero";
import dayjs from "dayjs";
import { Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getRegisterPeriod } from "../api/get-register-month";
import { CardMetrica } from "../components/CardMetrica";
import { ChartArea } from "../components/ChartArea";
import { ChartPie } from "../components/ChartPie";

export function DashboardLayout() {
  const [data, setData] = useState<RegistroTypeDB[] | []>([]);
  const [isLoading, setLoading] = useState(true);

  const [date, setDate] = useState(() => {
    const primerDia = dayjs().startOf("month").format("YYYY-MM-DD");
    const ultimoDia = dayjs().endOf("month").add(1, "day").format("YYYY-MM-DD");

    return { primer: primerDia, ultimo: ultimoDia };
  });

  const handleDate = (periodo: string) => {
    console.log(periodo);
    let primer;
    let ultimo;
    if (periodo === "semana") {
      primer = dayjs().startOf("week").format("YYYY-MM-DD");
      ultimo = dayjs().endOf("week").add(1, "day").format("YYYY-MM-DD");
    } else if (periodo === "mes") {
      primer = dayjs().startOf("month").format("YYYY-MM-DD");
      ultimo = dayjs().endOf("month").add(1, "day").format("YYYY-MM-DD");
    } else if (periodo === "semestre") {
      primer = dayjs().subtract(6, "month").format("YYYY-MM-DD");
      ultimo = dayjs().add(1, "day").format("YYYY-MM-DD");
    } else if (periodo === "año") {
      primer = dayjs().subtract(1, "year").format("YYYY-MM-DD");
      ultimo = dayjs().add(1, "day").format("YYYY-MM-DD");
    } else if (periodo === "todo") {
      primer = dayjs().subtract(5, "year").format("YYYY-MM-DD");
      ultimo = dayjs().add(1, "day").format("YYYY-MM-DD");
    }
    if (primer && ultimo) setDate({ primer, ultimo });
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await getRegisterPeriod(
          date.primer,
          date.ultimo,
        );
        if (error) {
          return;
        }
        setData(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [date]);

  const dataMetricas = useMemo(() => {
    const dataIncompleta = data.reduce(
      (prev: Record<string, number>, current) => {
        prev[current.tipo] = (prev[current.tipo] || 0) + current.valor;
        return prev;
      },
      {},
    );
    return {
      Ingreso: dataIncompleta.Ingreso || 0,
      Egreso: dataIncompleta.Egreso || 0,
    };
  }, [data]);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1 className="text-5xl text-center font-bold">Dashboard</h1>
      <Select defaultValue="mes" onValueChange={handleDate}>
        <SelectTrigger className="w-full max-w-xs mx-auto lg:ms-auto lg:me-0 my-5">
          <SelectValue placeholder="Seleccione un periodo" />
        </SelectTrigger>
        <SelectContent
          className="bg-black/30 backdrop-blur-xl"
          position="popper"
        >
          <SelectGroup>
            <SelectItem value="semana">Ultima semana</SelectItem>
            <SelectItem value="mes">Ultimo mes</SelectItem>
            <SelectItem value="semestre">Ultimo semestre</SelectItem>
            <SelectItem value="año">Ultimo año</SelectItem>
            <SelectItem value="todo">Todos (Ultimos 5 años)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {isLoading && (
        <div className="w-full flex justify-center my-3">
          <Loader className="animate-spin duration-2000" size={36} />
        </div>
      )}
      {/* Metricas - Será un componente creo xd , ya lo es :D*/}

      {!isLoading && (
        <>
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full gap-3 my-5">
            <CardMetrica
              text="Ingresos"
              value={formatearDinero(dataMetricas.Ingreso) || 0}
            />
            <CardMetrica
              text="Egresos"
              value={formatearDinero(dataMetricas.Egreso) || 0}
            />
            <CardMetrica text="Registros" value={data.length} />
            <ChartArea
              className=" col-start-1 col-end-3 lg:col-start-1 lg:col-end-4 mb-3 lg:mb-0"
              data={data}
              date={date}
            />
            <ChartPie
              className="col-start-1 col-end-3 lg:col-start-4 lg:col-end-6 lg:row-start-1 lg:row-end-3"
              date={date}
              data={data}
            />
          </section>
        </>
      )}
    </>
  );
}

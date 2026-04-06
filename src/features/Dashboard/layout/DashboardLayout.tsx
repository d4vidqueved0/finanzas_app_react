import type { RegistroTypeDB } from "@/features/Finanzas/api/create-register";
import { formatearDinero } from "@/utils/formatearDInero";
import dayjs from "dayjs";
import { Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getRegisterMonth } from "../api/get-register-month";
import { CardMetrica } from "../components/CardMetrica";
import { ChartArea } from "../components/ChartArea";

export function DashboardLayout() {
  const [data, setData] = useState<RegistroTypeDB[] | []>([]);
  const [isLoading, setLoading] = useState(true);
  const primerDia = dayjs().startOf("month").format("YYYY-MM-DD");
  const ultimoDia = dayjs().endOf("month").add(1, "day").format("YYYY-MM-DD");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await getRegisterMonth(primerDia, ultimoDia);
        if (error) {
          return;
        }
        setData(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [primerDia, ultimoDia]);

  const dataMetricas = useMemo(() => {
    return data.reduce((prev: Record<string, number>, current) => {
      prev[current.tipo] = (prev[current.tipo] || 0) + current.valor;
      return prev;
    }, {});
  }, [data]);

  return (
    <>
      <h1 className="text-5xl text-center font-bold">Dashboard</h1>

      {isLoading && (
        <div className="w-full flex justify-center my-3">
          <Loader className="animate-spin duration-2000" size={36} />
        </div>
      )}
      {/* Metricas - Será un componente creo xd , ya lo es :D*/}

      {!isLoading && (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-5 w-full gap-3 my-5">
            <CardMetrica
              text="Ingresos"
              value={formatearDinero(dataMetricas.Ingreso) || 0}
            />
            <CardMetrica
              text="Egresos"
              value={formatearDinero(dataMetricas.Egreso) || 0}
            />
            <CardMetrica text="Registros" value={data.length} />
            <CardMetrica
              text="Salud Financiera"
              value={`${((dataMetricas.Egreso * 100) / dataMetricas.Ingreso).toFixed(1)}%`}
            />
          </section>

          {/* Graficos - tambien será un componenete pero de momento se queda aki jeje, ya lo es :P */}
          <section className="grid-cols-1 lg:grid-cols-2">
            <ChartArea data={data} />
          </section>
        </>
      )}
    </>
  );
}

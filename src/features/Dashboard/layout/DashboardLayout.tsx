import { Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import type { RegistroTypeDB } from "@/features/Finanzas/api/create-register";
import { formatearDinero } from "@/utils/formatearDInero";
import dayjs from "dayjs";
import { Info, Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getRegisterMonth } from "../api/get-register-month";
import { CardMetrica } from "../components/CardMetrica";
import { ChartArea } from "../components/ChartArea";
import { ChartPie } from "../components/ChartPie";

export function DashboardLayout() {
  const [data, setData] = useState<RegistroTypeDB[] | []>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const primerDia = dayjs().startOf("month").format("YYYY-MM-DD");
      const ultimoDia = dayjs()
        .endOf("month")
        .add(1, "day")
        .format("YYYY-MM-DD");
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
  }, []);

  const dataMetricas = useMemo(() => {
    const dataIncompleta = data.reduce(
      (prev: Record<string, number>, current) => {
        prev[current.tipo] = (prev[current.tipo] || 0) + current.valor;
        return prev;
      },
      {},
    );
    const saludFinanciera =
      (dataIncompleta.Egreso * 100) / dataIncompleta.Ingreso;

    return {
      Ingreso: dataIncompleta.Ingreso || 0,
      Egreso: dataIncompleta.Egreso || 0,
      Salud: Number(saludFinanciera.toFixed(1)),
    };
  }, [data]);

  console.log(dataMetricas);
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
              icon={
                <>
                  {" "}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="text-blue-700" size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        La salud financiera representa un calculo porcentual de
                        egresos sobre ingresos. Una salud financiera buena está
                        por debajo del 50%
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </>
              }
              className={"flex items-center justify-between"}
              value={(dataMetricas.Egreso * 100) / dataMetricas.Ingreso}
            ></CardMetrica>
          </section>

          {/* Graficos - tambien será un componenete pero de momento se queda aki jeje, ya lo es :P */}
          <section className="grid gap-3  grid-cols-1 lg:grid-cols-3">
            <ChartArea className="col-start-1 col-end-3" data={data} />
            <ChartPie data={data} />
          </section>
        </>
      )}
    </>
  );
}

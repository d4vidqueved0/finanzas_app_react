import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { RegistroTypeDB } from "@/features/Finanzas/api/create-register";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

interface ChartAreaProps {
  data: RegistroTypeDB[];
  className?: string;
  date: { primer: string; ultimo: string };
}

const chartConfig = {
  Ingreso: {
    label: "Ingreso",
    color: "#193cb8",
  },
  Egreso: {
    label: "Egreso",
    color: "#669cb8",
  },
} satisfies ChartConfig;

export function ChartArea({ data, className, date }: ChartAreaProps) {
  const dataChart = useMemo(() => {
    // const primerDia = dayjs().startOf("month");
    // const cantidadMes = dayjs(primerDia).daysInMonth();
    // const mesActual = dayjs(primerDia).format("YYYY-MM");
    const dias: Record<string, object> = {};
    // for (let i = 1; i <= cantidadMes; i++) {
    //   const fecha = `${mesActual}-${String(i).padStart(2, "0")}`;
    //   dias[fecha] = { Ingreso: 0, Egreso: 0 };
    // }

    let auxDay = date.primer;
    const ultimoDia = date.ultimo;

    while (auxDay !== ultimoDia) {
      dias[auxDay] = { Ingreso: 0, Egreso: 0 };
      auxDay = dayjs(auxDay).add(1, "day").format("YYYY-MM-DD");
    }

    console.log(dias);

    const dataFormat = data.reduce((prev, act) => {
      const fecha = act.created_at?.split("T")[0];
      if (fecha && Object.hasOwn(prev, fecha)) {
        (prev[fecha] as Record<"Ingreso" | "Egreso", number>)[
          act.tipo as "Ingreso" | "Egreso"
        ] += 1;
      }
      return prev;
    }, dias);
    console.log(dataFormat);
    return Object.keys(dataFormat).map((fecha) => ({
      fecha,
      Ingreso: (dataFormat[fecha] as Record<"Ingreso" | "Egreso", number>)[
        "Ingreso"
      ],
      Egreso: (dataFormat[fecha] as Record<"Ingreso" | "Egreso", number>)[
        "Egreso"
      ],
    }));
  }, [data, date.primer, date.ultimo]);

  console.log(dataChart);

  return (
    <Card className={`pt-0 dark:bg-black/30 backdrop-blur-xl ${className}`}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Grafico de Área interactivo</CardTitle>
          <CardDescription>
            Mostrando el total de registros por día desde el{" "}
            <strong>
              {dayjs(date.primer).format("DD MMMM [del] YYYY")} hasta{" "}
              {dayjs(date.ultimo)
                .subtract(1, "days")
                .format("DD MMMM [del] YYYY")}
            </strong>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={dataChart}>
            <defs>
              <linearGradient id="fillEgreso" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Egreso)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Egreso)"
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient id="fillIngreso" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Ingreso)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Ingreso)"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fecha"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = dayjs(value).format("D MMMM YY");
                return date;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = dayjs(value).format("DD MMMM YYYY");
                    return date;
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="Egreso"
              type="monotone"
              fill="url(#fillEgreso)"
              stroke="var(--color-Egreso)"
              stackId="a"
            />
            <Area
              dataKey="Ingreso"
              type="monotone"
              fill="url(#fillIngreso)"
              stroke="var(--color-Ingreso)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

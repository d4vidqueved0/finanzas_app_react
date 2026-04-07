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
}

const chartConfig = {
  registro: {
    label: "Registro",
    color: "blue",
  },
} satisfies ChartConfig;

export function ChartArea({ data, className }: ChartAreaProps) {
  const dataChart = useMemo(() => {
    const primerDia = dayjs().startOf("month");
    const cantidadMes = dayjs(primerDia).daysInMonth();
    const mesActual = dayjs(primerDia).format("YYYY-MM");
    const dias: Record<string, number> = {};
    for (let i = 1; i <= cantidadMes; i++) {
      const fecha = `${mesActual}-${String(i).padStart(2, "0")}`;
      dias[fecha] = 0;
    }
    const dataFormat = data.reduce((prev, act) => {
      const fecha = act.created_at?.split("T")[0];
      if (fecha && Object.hasOwn(prev, fecha)) {
        prev[fecha] += 1;
      }
      return prev;
    }, dias);
    return Object.keys(dataFormat).map((fecha) => ({
      fecha,
      registro: dataFormat[fecha],
    }));
  }, [data]);

  console.log(dataChart);
  return (
    <Card className={`pt-0 dark:bg-black/30 backdrop-blur-xl ${className}`}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Grafico de Área interactivo</CardTitle>
          <CardDescription>
            Mostrando el total de registros por dia del mes{" "}
            {dayjs().format("MMMM")}
          </CardDescription>
        </div>
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select> */}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={dataChart}>
            <defs>
              <linearGradient id="fillRegistro" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-registro)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-registro)"
                  stopOpacity={0.1}
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
                const date = new Date(value);
                return date.toLocaleDateString("es-CL", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-CL", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                  color="white"
                />
              }
            />
            <Area
              dataKey="registro"
              type="monotone"
              fill="url(#fillRegistro)"
              stroke="var(--color-registro)"
              min={0}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

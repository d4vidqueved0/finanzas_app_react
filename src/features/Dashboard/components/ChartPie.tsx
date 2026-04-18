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
import { Pie, PieChart } from "recharts";

interface ChartPieProps {
  data: RegistroTypeDB[];
  className?: string;
  date: { primer: string; ultimo: string };
}

const chartConfig = {
  monto: { label: "Monto" },
  Ingreso: {
    label: "Ingresos",
    color: "#193cb8",
  },
  Egreso: {
    label: "Egresos",
    color: "#669cb8",
  },
} satisfies ChartConfig;

export function ChartPie({ data, className, date }: ChartPieProps) {
  const [dataChart] = useMemo(() => {
    const dataIncompleta = data.reduce(
      (prev, current) => {
        prev[current.tipo] = (prev[current.tipo] | 0) + current.valor;
        return prev;
      },
      {} as Record<string, number>,
    );

    const dataCompleta = Object.keys(dataIncompleta).map((key: string) => {
      return {
        tipo: key,
        valor: dataIncompleta[key],
        fill: `var(--color-${key})`,
      };
    });

    const total = dataCompleta.reduce((prev, current) => {
      prev += current.valor;

      return prev;
    }, 0);

    return [dataCompleta, total];
  }, [data]);

  console.log(dataChart);

  return (
    <Card
      className={`flex flex-col dark:bg-black/30 backdrop-blur-xl ${className}`}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle>Grafico de torta</CardTitle>
        <CardDescription className="text-md">
          {dayjs(date.primer).format("DD [de] MMMM [del] YYYY")} hasta el{" "}
          {dayjs(date.ultimo)
            .subtract(1, "day")
            .format("DD [de] MMMM [del] YYYY")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square "
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={dataChart} dataKey="valor" nameKey="tipo">
              <ChartLegend
                content={<ChartLegendContent nameKey="tipo" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

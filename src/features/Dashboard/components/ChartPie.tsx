import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { RegistroTypeDB } from "@/features/Finanzas/api/create-register";
import { formatearDinero } from "@/utils/formatearDInero";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

interface ChartPieProps {
  data: RegistroTypeDB[];
  className?: string;
}

const chartConfig = {
  valor: { label: "Monto Total" },
  Ingreso: {
    label: "Ingresos",
    color: "#193cb8",
  },
  Egreso: {
    label: "Egresos",
    color: "#669cb8",
  },
} satisfies ChartConfig;

export function ChartPie({ data, className }: ChartPieProps) {
  const [dataChart, total] = useMemo(() => {
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
        <CardTitle>Grafico de Torta</CardTitle>
        <CardDescription>Mes de {dayjs().format("MMMM")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  indicator="dashed"
                  formatter={(value, name) => (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{name}:</span>

                      <span>{formatearDinero(Number(value))}</span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={dataChart}
              dataKey="valor"
              nameKey="tipo"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-lG"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}

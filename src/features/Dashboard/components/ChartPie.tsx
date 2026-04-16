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
import { useMemo } from "react";
import { LabelList, Pie, PieChart } from "recharts";

interface ChartPieProps {
  data: RegistroTypeDB[];
  className?: string;
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
        <CardTitle>Pie Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={dataChart}
              dataKey="valor"
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="var(--foreground)"
                  >
                    {((payload.valor / total) * 100).toFixed(2) + "%"}
                  </text>
                );
              }}
              nameKey="tipo"
            >
              <LabelList
                dataKey="tipo"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />{" "}
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

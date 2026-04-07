import type { ReactNode } from "react";

interface CardMetricaProps {
  text: string;
  value: string | number;
  className?: string;
  icon?: ReactNode;
}

export function CardMetrica({
  text,
  value,
  className,
  icon,
}: CardMetricaProps) {
  console.log(text, value);
  return (
    <div className="flex flex-col dark:bg-black/30 backdrop-blur-xl border-2 rounded-xl aspect-video p-3 h-full overflow-scroll no-scrollbar">
      <h3 className={`text-md font-semibold ${className}`}>
        {text} {icon}
      </h3>

      {text === "Salud Financiera" && typeof value === "number" ? (
        <span
          className={`text-3xl flex grow items-center ${value >= 50 ? "text-red-800" : " text-blue-800"}`}
        >
          {value.toFixed(2)}%
        </span>
      ) : (
        <span className={`text-3xl flex grow items-center`}>{value}</span>
      )}
    </div>
  );
}

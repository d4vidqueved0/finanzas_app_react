interface CardMetricaProps {
  text: string;
  value: string | number;
}

export function CardMetrica({ text, value }: CardMetricaProps) {
  return (
    <div className="flex flex-col dark:bg-black/30 backdrop-blur-xl border-2 rounded-xl aspect-video p-3 h-full">
      <h3 className="text-md font-semibold">{text}</h3>
      <span className="text-3xl flex grow items-center">{value}</span>
    </div>
  );
}

import { Skeleton } from "@/components/index";

export function CardRegistroSkeleton() {
  return (
    <div className="w-full flex items-center justify-between border shadow-md shadow-black/50  px-4 py-2 border-b-4 rounded-xl">
      <div>
        <div className="flex gap-2 items-center mt-3">
          {/* Esqueleto para el Título (h3) */}
          <Skeleton className="h-8 w-45 sm:w-40" />
          {/* Esqueleto para el ícono de Pencil */}
        </div>

        <div className="flex flex-col mt-2">
          {/* Esqueleto para la Fecha */}
          <Skeleton className="h-3 w-30" />

          {/* Esqueleto para las Etiquetas (Badges) */}
          <div className="flex gap-2 mt-5">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Esqueleto para el Valor (Dinero) */}
      <Skeleton className="h-7 w-22.5 sm:w-20" />
    </div>
  );
}

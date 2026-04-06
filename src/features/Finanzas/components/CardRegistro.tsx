import { formatearDinero } from "@/utils/formatearDInero";
import { formatearFecha } from "@/utils/formatearFecha";
import { Pencil, Trash } from "lucide-react";
import type { RegistroTypeDB } from "../api/create-register";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
} from "@/components";

const ESTILOS_TIPO = {
  Ingreso: "border-b-blue-500",
  Egreso: "border-b-red-500",
};

export function CardRegistro({
  registro,
  handleDelete,
}: {
  registro: RegistroTypeDB;
  handleDelete: (id: string) => void;
}) {
  return (
    <Card
      className={`w-full flex flex-row items-center justify-between border shadow-md shadow-black/50 px-4 py-2 border-b-4 rounded-xl  ${ESTILOS_TIPO[registro.tipo]}`}
    >
      <div>
        <div className="flex gap-2 items-center mt-3">
          <h3 className="font-bold text-2xl capitalize line-clamp-1">
            {registro.titulo}
          </h3>
          <Pencil size={16} className="hover:scale-120 transition-all" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs">
            {formatearFecha(registro.created_at || "No hay fecha")}
          </span>
          <div className="flex gap-2 mt-5">
            {registro.etiquetas.length == 0 && (
              <span className="opacity-0">-</span>
            )}

            {registro.etiquetas.map((etiqueta, index) => (
              <Badge key={index} variant={"secondary"}>
                {etiqueta}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center flex-col">
        <span className="text-lg font-semibold truncate">
          {formatearDinero(registro.valor)}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="link" className="hover:scale-125">
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Estás seguro de eliminar este registro?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta accion no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                variant={"destructive"}
                onClick={() => {
                  if (registro.id) handleDelete(registro.id);
                }}
              >
                Si, eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}

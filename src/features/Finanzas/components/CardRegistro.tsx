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
import { formatearDinero } from "@/utils/formatearDInero";
import { formatearFecha } from "@/utils/formatearFecha";
import { Circle, CircleCheckBig, Pencil, Trash } from "lucide-react";
import type { RegistroTypeDB } from "../api/create-register";

const ESTILOS_TIPO = {
  Ingreso: "border-b-blue-500",
  Egreso: "border-b-red-500",
};

interface CardRegistroProps {
  registro: RegistroTypeDB;
  handleDelete: (id: string) => void;
  handleEtiqueta: (etiqueta: string) => void;
  etiquetaFiltro: string;
  handleEdit: (registro: RegistroTypeDB) => void;
  handleDeleteRegister?: undefined | ((idRegistro: string) => void);
  isSelect: boolean;
}

export function CardRegistro({
  registro,
  handleDelete,
  handleEtiqueta,
  etiquetaFiltro,
  handleEdit,
  isSelect,
  handleDeleteRegister = undefined,
}: CardRegistroProps) {
  return (
    <Card
      onClick={
        handleDeleteRegister !== undefined
          ? () => {
              if (registro.id) handleDeleteRegister(registro.id);
            }
          : undefined
      }
      className={`w-full bg-black/30 backdrop-blur-xl grid grid-cols-3 items-center justify-between border shadow-md shadow-black/50 px-4 py-2 border-b-4 rounded-xl  ${ESTILOS_TIPO[registro.tipo]} ${handleDeleteRegister !== undefined ? "relative" : " "}`}
    >
      <div className="col-start-1 col-end-3">
        {handleDeleteRegister !== undefined &&
          (isSelect ? (
            <CircleCheckBig size={16} className="absolute top-0 right-0 m-2" />
          ) : (
            <Circle size={16} className="absolute top-0 right-0 m-2" />
          ))}
        <div className="flex gap-2 items-center mt-3">
          <h3 className="font-bold text-2xl capitalize line-clamp-1">
            {registro.titulo}
          </h3>
          <Pencil
            onClick={() => {
              handleEdit(registro);
            }}
            size={16}
            className="hover:scale-120 transition-all"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs">
            {formatearFecha(registro.created_at || "No hay fecha")}
          </span>
          <div className="flex gap-2 mt-5 overflow-scroll no-scrollbar">
            {registro.etiquetas.length == 0 && (
              <span className="opacity-0">-</span>
            )}

            {registro.etiquetas.map((etiqueta, index) => (
              <Badge
                key={index}
                variant={etiquetaFiltro === etiqueta ? "default" : "secondary"}
                onClick={() => {
                  handleEtiqueta(etiqueta);
                }}
              >
                <Button
                  variant={
                    etiquetaFiltro === etiqueta ? "default" : "secondary"
                  }
                >
                  {etiqueta}
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center flex-col">
        <span className="text-lg font-semibold truncate">
          {(() => {
            const formatted = formatearDinero(registro.valor) || "";
            return registro.valor !== undefined && formatted.length > 8
              ? `${formatted.slice(0, 8)}...`
              : formatted;
          })()}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="link" className="hover:scale-125">
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-black/30 backdrop-blur-xl">
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

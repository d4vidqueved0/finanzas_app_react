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
  Button,
} from "@/components/index";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import type { RegistroTypeDB } from "../api/create-register";
import { deleteManyRegister } from "../api/delete-many-registers";
import { deleteRegister } from "../api/delete-register";
import { getAllRegisterFilters } from "../api/get-all-register-filter";
import { AddRegistro } from "../components/AddRegistro";
import { CardRegistro } from "../components/CardRegistro";
import { EditRegistro } from "../components/EditRegistro";
import { Filtros } from "../components/Filtros";
import { SelectorFecha } from "../components/SelectorFecha";
import { useFinanzasStore } from "../store/useFinanzasStore";

let timeMouse: number = 0;
let interval: ReturnType<typeof setInterval>;

export function FinanzasLayout() {
  const { filters } = useFinanzasStore();

  const queryClient = useQueryClient();

  const {
    data: registros,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["registros", filters],
    queryFn: () => getAllRegisterFilters(filters),
  });

  const [showFilters, setShowFilters] = useState(false);

  const [edit, setEdit] = useState<RegistroTypeDB | null>(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [deleteRegisters, setDeleteRegisters] = useState<string[] | []>([]);

  const [isDeleteActive, setDeleteActive] = useState(false);

  const handleEdit = (registro: RegistroTypeDB) => {
    setEdit(registro);
    setIsOpenEdit(true);
  };

  const handleDialog = () => {
    setIsOpenEdit((prev) => !prev);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteRegister(id);
    if (error) {
      toast.error("Error al eliminar el registro.");
      return;
    }
    toast.success("Se eliminó correctamente el registro.");
    queryClient.invalidateQueries({ queryKey: ["registros"] });
  };

  const countTime = () => {
    interval = setInterval(() => {
      timeMouse = 500;
    }, 500);
  };

  const checkTime = () => {
    clearInterval(interval);

    if (timeMouse && timeMouse >= 500) {
      setDeleteActive(true);
    }
    timeMouse = 0;
  };

  useEffect(() => {
    document
      .getElementById("seccion-registros")
      ?.addEventListener("mousedown", countTime);
    document
      .getElementById("seccion-registros")
      ?.addEventListener("mouseup", checkTime);
    document
      .getElementById("seccion-registros")
      ?.addEventListener("touchstart", countTime);
    document
      .getElementById("seccion-registros")
      ?.addEventListener("touchend", checkTime);

    return () => {
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("mousedown", countTime);
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("mouseup", checkTime);
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("touchstart", countTime);
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("touchend", checkTime);
    };
  }, []);

  const handleDeleteRegisters = (idRegistro: string) => {
    if (!idRegistro) return;
    let newDelete: string[];
    const existe = deleteRegisters.filter((reg) => reg === idRegistro).length;
    if (existe) {
      newDelete = deleteRegisters.filter((reg) => reg !== idRegistro);
    } else {
      newDelete = [...deleteRegisters, idRegistro];
    }
    setDeleteRegisters(newDelete);
  };

  const handleDeleteManyRegisters = async () => {
    try {
      const response = await deleteManyRegister(deleteRegisters);
      if (response.error) {
        toast.error("Error al eliminar.");
        return;
      }
      toast.success("Se eliminaron los registros correctamente.");
      setDeleteRegisters([]);
      setDeleteActive(false);
      queryClient.invalidateQueries({ queryKey: ["registros"] });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Helmet>
        <title>Finanzas</title>
      </Helmet>
      <h1 className="text-5xl text-center font-bold">Finanzas</h1>
      <div
        className={`grid ${isDeleteActive ? "grid-rows-2" : "grid-rows-1"} gap-3 lg:gap-0 lg:flex lg:items-center lg:justify-between my-5`}
      >
        <div className="flex items-center justify-between gap w-full">
          <AddRegistro fechaRegistro={filters.created_at} />
          <Button
            onClick={() => {
              setShowFilters((prev) => !prev);
            }}
            variant={"outline"}
          >
            <SlidersHorizontal />
            Filtros
          </Button>
        </div>
        <div className="flex items-center gap-3 lg:ms-3 justify-between">
          {isDeleteActive &&
            (deleteRegisters.length > 0 ? (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"}>
                      Eliminar {deleteRegisters.length}{" "}
                      {deleteRegisters.length > 1 ? " registros" : " registro"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black/30 backdrop-blur-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {"¿Estás seguro de eliminar " +
                          (deleteRegisters.length > 1
                            ? "estos registros?"
                            : "este registro?")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta accion no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        variant={"destructive"}
                        onClick={handleDeleteManyRegisters}
                      >
                        Si, eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <Button variant={"outline"}>
                No hay registros seleccionados
              </Button>
            ))}
          {isDeleteActive && (
            <Button
              variant={"outline"}
              onClick={() => {
                setDeleteActive(false);
                setDeleteRegisters([]);
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>
      <SelectorFecha />
      <Filtros showFilters={showFilters} />
      {error && (
        <div className="text-center text-xl text-red-600">{error.message}</div>
      )}
      {isLoading && (
        <div className="w-full flex justify-center my-3">
          <Loader className="animate-spin duration-2000" size={36} />
        </div>
      )}
      {!isLoading && registros?.length === 0 && (
        <div className="text-center text-xl mt-3">No hay registros.</div>
      )}
      <section
        id="seccion-registros"
        className="grid md:grid-cols-3 gap-4 mt-5 select-none"
        onContextMenu={(ev) => {
          ev.preventDefault();
        }}
      >
        {!isLoading &&
          registros &&
          registros.length > 0 &&
          registros.map((registro) => (
            <CardRegistro
              key={registro.id}
              registro={registro}
              handleDelete={handleDelete}
              etiquetaFiltro={filters.tag}
              handleEdit={handleEdit}
              handleDeleteRegister={
                isDeleteActive ? handleDeleteRegisters : undefined
              }
              isSelect={
                deleteRegisters.find((reg) => reg === registro.id)
                  ? true
                  : false
              }
            />
          ))}
      </section>
      {edit !== null && (
        <EditRegistro
          key={edit.id}
          open={isOpenEdit}
          handleDialog={handleDialog}
          registro={edit}
        />
      )}
    </>
  );
}

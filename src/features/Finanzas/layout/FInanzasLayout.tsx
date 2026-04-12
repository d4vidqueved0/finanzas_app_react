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
import { useState } from "react";
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
import { useLongTouch } from "../components/useLongTouch";
import { useFinanzasStore } from "../store/useFinanzasStore";

export function FinanzasLayout() {
  const { filters, isDeleteActive, handleDeleteActive } = useFinanzasStore();

  // Habilitar la opcion de eliminar multiples registros
  useLongTouch();

  const queryClient = useQueryClient();

  const {
    data: registros,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["registros", filters],
    queryFn: () => getAllRegisterFilters(filters),
  });

  const [showFilters, setShowFilters] = useState(false);

  const [edit, setEdit] = useState<RegistroTypeDB | null>(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [deleteRegisters, setDeleteRegisters] = useState<string[] | []>([]);

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
      handleDeleteActive(false);
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
                handleDeleteActive(false);
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
      {isFetching && (
        <div className="w-full flex justify-center my-3">
          <Loader className="animate-spin duration-2000" size={36} />
        </div>
      )}
      {!isFetching && registros?.length === 0 && (
        <div className="text-center text-xl mt-3">No hay registros.</div>
      )}
      <section
        id="seccion-registros"
        className="grid md:grid-cols-3 gap-4 mt-5 select-none"
        onContextMenu={(ev) => {
          ev.preventDefault();
        }}
      >
        {!isFetching &&
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

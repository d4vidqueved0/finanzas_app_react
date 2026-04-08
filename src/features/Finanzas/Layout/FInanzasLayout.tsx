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
import { formatearFecha } from "@/utils/formatearFecha";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight, Loader, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { RegistroTypeDB } from "../api/create-register";
import { deleteManyRegister } from "../api/delete-many-registers";
import { deleteRegister } from "../api/delete-register";
import { getAllRegisterFilters } from "../api/get-all-register-filter";
import { AddRegistro } from "../components/AddRegistro";
import { CardRegistro } from "../components/CardRegistro";
import { EditRegistro } from "../components/EditRegistro";
import { Filtros } from "../components/Filtros";

const fechaActual = dayjs().format("YYYY-MM-DD");
let timeMouse: number = 0;
let interval: ReturnType<typeof setInterval>;

export function FinanzasLayout() {
  const [registros, setRegistros] = useState<RegistroTypeDB[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(() => ({
    buscar: "",
    tipo: "",
    created_at: fechaActual,
    etiqueta: "",
  }));
  const [edit, setEdit] = useState<RegistroTypeDB | null>(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [deleteRegisters, setDeleteRegisters] = useState<string[] | []>([]);

  const [isDeleteActive, setDeleteActive] = useState(false);

  const handleEdit = (registro: RegistroTypeDB) => {
    console.log(registro);
    setEdit(registro);
    setIsOpenEdit(true);
  };

  const handleDialog = () => {
    setIsOpenEdit((prev) => !prev);
  };

  const getRegistersFilters = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllRegisterFilters(filters);
      console.log(data);
      if (error) {
        setError("Error al recuperar los registros.");
        return;
      }
      setRegistros(data);
      setError("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSearch = (buscar: string) => {
    setFilters((prev) => {
      return {
        ...prev,
        etiqueta: "",
        buscar,
        created_at: buscar === "" ? fechaActual : "Todas las fechas",
      };
    });
  };

  const handleType = (tipo: string) => {
    setFilters((prev) => {
      return { ...prev, etiqueta: "", tipo, created_at: "Todas las fechas" };
    });
  };

  const handleEtiqueta = (etiqueta: string) => {
    setFilters((prev) => {
      if (prev.etiqueta === etiqueta) {
        return { ...prev, etiqueta: "", created_at: fechaActual };
      }
      return { ...prev, etiqueta, created_at: "Todas las fechas" };
    });
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      getRegistersFilters();
    }, 200);

    return () => {
      clearTimeout(timeOut);
    };
  }, [getRegistersFilters]);

  const addDay = () => {
    setFilters((prev) => {
      return {
        ...prev,
        etiqueta: "",
        created_at: dayjs(
          prev.created_at === "Todas las fechas"
            ? fechaActual
            : prev.created_at,
        )
          .add(1, "day")
          .format("YYYY-MM-DD"),
      };
    });
  };

  const lessDay = () => {
    setFilters((prev) => {
      return {
        ...prev,
        etiqueta: "",
        created_at: dayjs(
          prev.created_at === "Todas las fechas"
            ? fechaActual
            : prev.created_at,
        )
          .subtract(1, "day")
          .format("YYYY-MM-DD"),
      };
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteRegister(id);
    if (error) {
      toast.error("Error al eliminar el registro.");
      return;
    }
    toast.success("Se eliminó correctamente el registro.");
    getRegistersFilters();
  };

  const clearFilters = () => {
    setFilters({
      buscar: "",
      tipo: "",
      created_at: fechaActual,
      etiqueta: "",
    });
  };

  const testEvent = () => {
    console.log("DOWN");
    interval = setInterval(() => {
      timeMouse = 500;
    }, 500);
  };

  const checkTime = () => {
    console.log("UP");
    console.log(timeMouse);
    clearInterval(interval);

    if (timeMouse && timeMouse >= 500) {
      setDeleteActive(true);
    }
    timeMouse = 0;
  };

  useEffect(() => {
    document
      .getElementById("seccion-registros")
      ?.addEventListener("mousedown", testEvent);
    document
      .getElementById("seccion-registros")
      ?.addEventListener("mouseup", checkTime);
    document
      .getElementById("seccion-registros")
      ?.addEventListener("touchstart", testEvent);
    document
      .getElementById("seccion-registros")
      ?.addEventListener("touchend", checkTime);

    return () => {
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("mousedown", testEvent);
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("mouseup", checkTime);
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("touchstart", testEvent);
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

  // console.log(timeMouse);

  // console.log(deleteRegisters);

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
      getRegistersFilters();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <h1 className="text-5xl text-center font-bold">Finanzas</h1>
      <div className="grid grid-rows-2 gap-3 lg:gap-0 lg:flex lg:items-center lg:justify-between my-5">
        <div className="flex items-center justify-between gap w-full">
          <AddRegistro
            getRegisters={getRegistersFilters}
            fechaRegistro={filters.created_at}
          />
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

      {/* Filtros */}
      <section className="w-full flex items-center justify-between mb-3">
        <Button onClick={lessDay}>
          <ArrowLeft />
        </Button>
        <span>
          {filters.created_at === "Todas las fechas"
            ? "Todas las fechas"
            : formatearFecha(filters.created_at)}
        </span>
        <Button onClick={addDay}>
          <ArrowRight />
        </Button>
      </section>

      <Filtros
        clearFilters={clearFilters}
        handleSearch={handleSearch}
        handleType={handleType}
        showFilters={showFilters}
      />
      {error && <div className="text-center text-xl text-red-600">{error}</div>}
      {loading && (
        <div className="w-full flex justify-center my-3">
          <Loader className="animate-spin duration-2000" size={36} />
        </div>
      )}
      {!loading && registros.length === 0 && (
        <div className="text-center text-xl mt-3">No hay registros.</div>
      )}
      <section
        id="seccion-registros"
        className="grid lg:grid-cols-3 gap-4 mt-5"
      >
        {!loading &&
          registros.length > 0 &&
          registros.map((registro) => (
            <CardRegistro
              key={registro.id}
              registro={registro}
              handleDelete={handleDelete}
              handleEtiqueta={handleEtiqueta}
              etiquetaFiltro={filters.etiqueta}
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
          refrescarRegistros={getRegistersFilters}
          key={edit.id}
          open={isOpenEdit}
          handleDialog={handleDialog}
          registro={edit}
        />
      )}
    </>
  );
}

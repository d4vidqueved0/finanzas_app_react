import { useEffect, useState } from "react";
import { AddRegistro } from "../components/AddRegistro";
import { ArrowLeft, ArrowRight, Loader, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/index";
import type { RegistroTypeDB } from "../api/create-register";
import { CardRegistro } from "../components/CardRegistro";
// import { CardRegistroSkeleton } from "../components/CardRegistroSkeleton";
import { getAllRegisterFilters } from "../api/get-all-register-filter";
import { Filtros } from "../components/Filtros";
import { formatearFecha } from "@/utils/formatearFecha";
import dayjs from "dayjs";
import { deleteRegister } from "../api/delete-register";
import { toast } from "sonner";

const fechaActual = dayjs().format("YYYY-MM-DD");

console.log(fechaActual);

export function FinanzasLayout() {
  const [registros, setRegistros] = useState<RegistroTypeDB[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(() => ({
    buscar: "",
    tipo: "",
    created_at: fechaActual,
  }));

  // const getRegisters = async () => {
  //   setLoading(true);
  //   try {
  //     const { data, error } = await getAllRegister();
  //     console.log(data);
  //     if (error) {
  //       setError("Error al recuperar los registros.");
  //       return;
  //     }
  //     setRegistros(data);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getRegistersFilters = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllRegisterFilters(filters);
      console.log(data);
      if (error) {
        setError("Error al recuperar los registros.");
        return;
      }
      setRegistros(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (buscar: string) => {
    setFilters((prev) => {
      return { ...prev, buscar };
    });
  };

  const handleType = (tipo: string) => {
    setFilters((prev) => {
      return { ...prev, tipo };
    });
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      getRegistersFilters();
    }, 200);

    return () => {
      clearTimeout(timeOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const addDay = () => {
    setFilters((prev) => {
      return {
        ...prev,
        created_at: dayjs(prev.created_at).add(1, "day").format("YYYY-MM-DD"),
      };
    });
  };

  const lessDay = () => {
    setFilters((prev) => {
      return {
        ...prev,
        created_at: dayjs(prev.created_at)
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

  return (
    <>
      <h1 className="text-5xl text-center font-bold">Finanzas</h1>
      <div className="flex items-center justify-between my-5">
        <AddRegistro getRegisters={getRegistersFilters} />
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
      {/* Filtros */}
      <section className="w-full flex items-center justify-between mb-3">
        <Button onClick={lessDay}>
          <ArrowLeft />
        </Button>
        <span>{formatearFecha(filters.created_at)}</span>
        <Button onClick={addDay}>
          <ArrowRight />
        </Button>
      </section>

      <Filtros
        handleSearch={handleSearch}
        handleType={handleType}
        showFilters={showFilters}
      />
      {error && <div className="text-center text-xl text-red-600">{error}</div>}
      {loading && (
        // <section className="grid lg:grid-cols-3 gap-4 mt-5">
        //   {Array.from({ length: 3 }).map((_, index) => (
        //     <CardRegistroSkeleton key={index} />
        //   ))}
        // </section>
        <div className="w-full flex justify-center">
          <Loader className="animate-spin duration-2000" size={36} />
        </div>
      )}
      {!loading && registros.length === 0 && (
        <div className="text-center text-xl mt-3">No hay registros.</div>
      )}
      <section className="grid lg:grid-cols-3 gap-4 mt-5">
        {!loading &&
          registros.length > 0 &&
          registros.map((registro) => (
            <CardRegistro
              key={registro.id}
              registro={registro}
              handleDelete={handleDelete}
            />
          ))}
      </section>
    </>
  );
}

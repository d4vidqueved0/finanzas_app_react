import { useEffect, useState } from "react";
import { AddRegistro } from "../components/AddRegistro";
import { getAllRegister } from "../api/get-all-register";
import { SlidersHorizontal } from "lucide-react";
import {
  Button,
  Card,
  Field,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/index";
import type { RegistroTypeDB } from "../api/create-register";
import { CardRegistro } from "../components/CardRegistro";
import { CardRegistroSkeleton } from "../components/CardRegistroSkeleton";
import { getAllRegisterFilters } from "../api/get-all-register-filter";
export function FinanzasLayout() {
  const [registros, setRegistros] = useState<RegistroTypeDB[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    buscar: "",
    tipo: "",
  });

  const getRegisters = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllRegister();
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

  // useEffect(() => {
  //   getRegisters();
  // }, []);

  useEffect(() => {
    let timeOut: ReturnType<typeof setTimeout>;
    if (filters.buscar !== "" || filters.tipo !== "") {
      timeOut = setTimeout(() => {
        getRegistersFilters();
      }, 300);
    } else {
      getRegisters();
    }
    return () => {
      clearTimeout(timeOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <>
      <h1 className="text-5xl text-center font-bold">Finanzas</h1>
      <div className="flex items-center justify-between my-5">
        <AddRegistro getRegisters={getRegisters} />
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
      <Card
        className={`mt-5 px-5 transition-all p-0 m-0 ${showFilters ? "opacity-100" : "opacity-0 translate-y-full h-0"}`}
      >
        <div className="p-5 flex flex-col gap-3">
          <Field>
            <Label>Buscar</Label>
            <Input
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                handleSearch(ev.target.value);
              }}
              name="buscar"
              placeholder="Buscar gasto"
              type="search"
            />
          </Field>
          <Field>
            <Label htmlFor="">Tipo de gasto</Label>
            <Select
              onValueChange={(value: string) => {
                handleType(value);
              }}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Ingreso">Ingreso</SelectItem>
                  <SelectItem value="Egreso">Egreso</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Card>

      {error && <div className="text-center text-xl text-red-600">{error}</div>}
      {loading && (
        <section className="grid lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardRegistroSkeleton key={index} />
          ))}
        </section>
      )}
      {!loading && registros.length === 0 && (
        <div className="text-center text-xl mt-3">No hay registros.</div>
      )}
      <section className="grid lg:grid-cols-3 gap-8 mt-5">
        {registros.map((registro) => (
          <CardRegistro key={registro.id} registro={registro} />
        ))}
      </section>
    </>
  );
}

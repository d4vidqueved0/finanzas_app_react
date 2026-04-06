import {
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
} from "@/components";

interface FiltrosProps {
  showFilters: boolean;
  handleSearch: (buscar: string) => void;
  handleType: (value: string) => void;
}
export function Filtros({
  showFilters,
  handleSearch,
  handleType,
}: FiltrosProps) {
  return (
    <Card
      className={`bg-black/30 backdrop-blur-xl mt-5 px-5 transition-all p-0 m-0 ${showFilters ? "opacity-100" : "opacity-0 translate-y-full h-0"}`}
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
  );
}

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/index";
import { useAuthStore } from "@/features/Auth/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, XIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createRegister } from "../api/create-register";
import { Registro, type RegistroType } from "../types/form";

interface AddRegistroProps {
  fechaRegistro: string;
}

export function AddRegistro({ fechaRegistro }: AddRegistroProps) {
  const { control, handleSubmit, reset } = useForm<RegistroType>({
    resolver: zodResolver(Registro),
    defaultValues: {
      titulo: "",
      valor: "" as never,
      tipo: "" as never,
      etiquetas: [{ etiqueta: "" }],
    },
  });

  const queryClient = useQueryClient();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "etiquetas",
  });

  const [isLoading, setLoading] = useState(false);

  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    console.log(isOpen);
    setOpen((prev) => !prev);
  };

  const { session } = useAuthStore();

  const onSubmit = async (data: RegistroType) => {
    setLoading(true);
    try {
      const dataFormateada = {
        ...data,
        etiquetas: data.etiquetas.map((etiqueta) => etiqueta.etiqueta),
        created_at: fechaRegistro,
        user_fk: session?.user?.id,
      };
      const response = await createRegister(dataFormateada);
      if (response.error) {
        toast.error("Error al guardar.");
        return;
      }
      toast.success("Se guardó correctamente.");
      queryClient.invalidateQueries({ queryKey: ["registros"] });
      reset();
      handleOpen();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer"
          onClick={handleOpen}
          variant={"outline"}
        >
          Añadir un registro {isOpen}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-5 bg-black/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Agregar registro</DialogTitle>
          <DialogDescription>
            Completa los siguientes campos para añadir un registro.
          </DialogDescription>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="max-h-80 p-1 overflow-y-scroll overflow-x-hidden no-scrollbar">
              <Controller
                name="titulo"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="titulo">Titulo</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      {...field}
                      id="titulo"
                      placeholder="Comprar leche"
                    />
                    <FieldError>{fieldState.error?.message || " "}</FieldError>
                  </Field>
                )}
              />

              <Controller
                name="valor"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="valor">Valor</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      {...field}
                      id="valor"
                      onChange={(e) => {
                        const valorIngresado = e.target.value;
                        const num = Number(valorIngresado);
                        field.onChange(isNaN(num) ? 0 : num);
                      }}
                      placeholder="10.000"
                    />
                    <FieldError>{fieldState.error?.message || " "}</FieldError>
                  </Field>
                )}
              />

              <Controller
                name="tipo"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="tipo">Tipo de gasto</FieldLabel>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="w-45"
                      >
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectItem value="Ingreso">Ingreso</SelectItem>
                          <SelectItem value="Egreso">Egreso</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message || " "}</FieldError>
                  </Field>
                )}
              />
              <FieldSet>
                <FieldLegend>Etiquetas</FieldLegend>
                <FieldDescription>
                  Agrega hasta 5 etiquetas para organizar tus registros.
                </FieldDescription>

                <FieldGroup>
                  {fields.map((field, index) => (
                    <Controller
                      key={field.id}
                      name={`etiquetas.${index}.etiqueta`}
                      control={control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                {...controllerField}
                                id={`form-rhf-array-etiqueta-${index}`}
                                aria-invalid={fieldState.invalid}
                                placeholder="Etiqueta"
                              />
                              {fields.length > 1 && (
                                <InputGroupAddon align="inline-end">
                                  <InputGroupButton
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => remove(index)}
                                    aria-label={`Remove etiqueta ${index + 1}`}
                                  >
                                    <XIcon />
                                  </InputGroupButton>
                                </InputGroupAddon>
                              )}
                            </InputGroup>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ etiqueta: "" })}
                    disabled={fields.length >= 5}
                  >
                    Añadir etiqueta
                  </Button>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
            <Field className="mt-4">
              <Button variant={"default"} disabled={isLoading}>
                {isLoading ? (
                  <>
                    Guardando
                    <LoaderCircle className="animate-spin" />
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
              <DialogClose asChild>
                <Button className="w-full" variant={"secondary"}>
                  Cancelar
                </Button>
              </DialogClose>
            </Field>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

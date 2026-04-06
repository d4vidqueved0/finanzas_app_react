import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  Button,
  FieldGroup,
  Field,
  FieldLabel,
  Input,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
  DialogClose,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldContent,
  InputGroupInput,
  InputGroup,
  InputGroupButton,
  InputGroupAddon,
} from "@/components/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Registro, type RegistroType } from "../types/form";
import { XIcon } from "lucide-react";
import type { RegistroTypeDB } from "../api/create-register";
import { updateRegister } from "../api/update-register";
import { toast } from "sonner";

interface EditRegistroProps {
  registro: RegistroTypeDB;
  open: boolean;
  handleDialog: () => void;
  refrescarRegistros: () => void;
}

export function EditRegistro({
  registro,
  open,
  handleDialog,
  refrescarRegistros,
}: EditRegistroProps) {
  console.log(registro);
  const {
    control,
    handleSubmit,
    formState: { isLoading },
  } = useForm<RegistroType>({
    resolver: zodResolver(Registro),
    defaultValues: {
      titulo: registro.titulo,
      valor: registro.valor,
      tipo: registro.tipo,
      etiquetas: registro.etiquetas.map((etiqueta) => {
        return { etiqueta: etiqueta };
      }),
    },
  });

  const { fields, remove, append } = useFieldArray({
    control: control,
    name: "etiquetas",
  });

  const onSubmit = async (data: RegistroType) => {
    const dataFormateada = {
      ...registro,
      ...data,
      etiquetas: data.etiquetas.map((etiqueta) => etiqueta.etiqueta),
    };
    const { error } = await updateRegister(dataFormateada);
    if (error) {
      toast.error("Error al actualizar el registro.");
      return;
    }
    toast.success("Se actualizó correctamente el registro.");
    refrescarRegistros();
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          handleDialog();
        }}
      >
        <DialogContent className="p-5">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar registro</DialogTitle>
            <DialogDescription>
              Completa los siguientes campos para editar un registro.
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
                      <FieldError>
                        {fieldState.error?.message || " "}
                      </FieldError>
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
                      <FieldError>
                        {fieldState.error?.message || " "}
                      </FieldError>
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
                      <FieldError>
                        {fieldState.error?.message || " "}
                      </FieldError>
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
                                  type="etiqueta"
                                />
                                {fields.length > 0 && (
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
                  Guardar
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
    </>
  );
}

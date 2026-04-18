import {
  Button,
  Card,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Loader } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { getInfoAccount } from "../api/get-info-account";

const schemaAccount = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Este campo no puede quedar vacio.")
    .optional(),
  imagen: z.file().optional(),
});

type schemaAccountType = z.infer<typeof schemaAccount>;

export function AccountLayout() {
  const { data, isFetching } = useQuery({
    queryKey: ["account"],
    queryFn: getInfoAccount,
  });

  const { handleSubmit, control } = useForm<schemaAccountType>({
    resolver: zodResolver(schemaAccount),
  });

  const onSubmit = (data: schemaAccountType) => {
    console.log(data);
  };
  return (
    <>
      <Helmet>
        <title>Cuenta</title>
      </Helmet>
      <h1 className="text-5xl text-center font-bold">Mi cuenta</h1>
      {isFetching && (
        <div className="w-full flex justify-center my-3">
          <Loader className="animate-spin duration-2000" size={36} />
        </div>
      )}

      {!isFetching && data && (
        <>
          <Card className="bg-black/30 backdrop-blur-xl px-5 py-12 mt-5">
            <div className="grid lg:grid-cols-2 gap-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="nombre"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          defaultValue={data.nombre}
                        />
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </Field>
                    )}
                  />

                  {/* <Controller
                    name="imagen"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="imagen">
                          Imagen de perfil
                        </FieldLabel>
                        <Input {...field} type="file" />
                      </Field>
                    )}
                  /> */}

                  <Field>
                    <FieldLabel htmlFor="nombre">
                      Fecha de creación de la cuenta
                    </FieldLabel>
                    <Input
                      disabled
                      className="cursor-not-allowed"
                      id="nombre"
                      name="nombre"
                      defaultValue={dayjs(data.created_at).format(
                        "DD [de] MMMM [del] YYYY",
                      )}
                    />
                  </Field>
                </FieldGroup>
                <Button className="mt-5 cursor-pointer transition-all active:scale-95">
                  Guardar
                </Button>
              </form>
              <FieldGroup>
                <Field className="items-center grow justify-center">
                  <img
                    id="imagen_actual"
                    src={data.foto_url}
                    className="max-w-42 object-contain rounded-full"
                  />
                </Field>
              </FieldGroup>
            </div>
          </Card>
        </>
      )}
    </>
  );
}

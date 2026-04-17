import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";
import z from "zod";
import { signUp } from "../api/sing-up";

const schemaSignUp = z
  .object({
    email: z.email("Correo invalido.").trim(),
    password: z
      .string("Este campo no puede quedar vacio.")
      .trim()
      .min(8, "Ingrese al menos 8 caracteres."),
    password_confirm: z
      .string("Este campo no puede quedar vacio.")
      .trim()
      .min(8, "Ingrese al menos 8 caracteres."),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Las contraseñas no coinciden.",
    path: ["password_confirm"],
  });

type schemaSignUpType = z.infer<typeof schemaSignUp>;

export function SignUp({ handleSwitch }: { handleSwitch: () => void }) {
  const [showPassword, setShowPassword] = useState("password");
  const [showConfirmPassword, setShowConfirm] = useState("password");

  const handleShowPassword = () => {
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleShowConfirm = () => {
    setShowConfirm((prev) => (prev === "password" ? "text" : "password"));
  };

  const { control, handleSubmit, reset } = useForm<schemaSignUpType>({
    resolver: zodResolver(schemaSignUp),
    defaultValues: {
      email: "",
      password: "",
      password_confirm: "",
    },
  });

  const onSubmit = async (data: schemaSignUpType) => {
    try {
      const { error } = await signUp(data.email, data.password);
      if (error) throw Error(error.message);
      toast.success("Se creó la cuenta correctamente.");
      reset();
      handleSwitch();
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else if (typeof error === "string") {
        toast.error(error);
      }
    }
  };
  return (
    <Card className="bg-black/30 backdrop-blur-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold mb-1">
            Crear una cuenta
          </CardTitle>
          <CardAction>
            <Button
              onClick={handleSwitch}
              className="cursor-pointer"
              variant={"link"}
              type="button"
            >
              Iniciar sesión
            </Button>
          </CardAction>
        </CardHeader>
        <CardDescription className="text-md px-4">
          Rellena los siguientes campos para crear una cuenta.
        </CardDescription>
        <CardContent className="flex flex-col gap-5 mt-6">
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="email">Email:</FieldLabel>
                <Input
                  id="email"
                  placeholder="Correo@ejemplo.com"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />

                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password">Contraseña:</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    {...field}
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    type={showPassword}
                  />

                  <InputGroupAddon
                    align={"inline-end"}
                    onClick={handleShowPassword}
                    className="cursor-pointer"
                  >
                    {showPassword === "password" ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupAddon>
                </InputGroup>

                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            control={control}
            name="password_confirm"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password_confirm">
                  Confirmar contraseña:
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password_confirm"
                    {...field}
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    type={showConfirmPassword}
                  />
                  <InputGroupAddon
                    onClick={handleShowConfirm}
                    align={"inline-end"}
                    className="cursor-pointer"
                  >
                    {showConfirmPassword === "password" ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </InputGroupAddon>
                </InputGroup>

                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3 bg-transparent backdrop-blur-xl">
          <Button
            className="w-full cursor-pointer transition-all active:scale-95"
            variant={"default"}
          >
            Crear cuenta
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

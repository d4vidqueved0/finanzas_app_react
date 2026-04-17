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

import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { loginWithEmail } from "../api/login-with-email";
import { loginWithGoogle } from "../api/login-with-google";

const schemaSignIn = z.object({
  email: z.email("Correo invalido.").trim(),
  password: z
    .string("Este campo no puede quedar vacio.")
    .trim()
    .min(8, "Ingrese al menos 8 caracteres."),
});
type schemaSignInType = z.infer<typeof schemaSignIn>;

export function SignIn({ handleSwitch }: { handleSwitch: () => void }) {
  const [showPassword, setShowPassword] = useState("password");

  const handleShowPassword = () => {
    setShowPassword((prev) => (prev === "password" ? "text" : "password"));
  };

  const { control, handleSubmit, reset } = useForm<schemaSignInType>({
    resolver: zodResolver(schemaSignIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const onSubmit = async (data: schemaSignInType) => {
    try {
      const { error } = await loginWithEmail(data.email, data.password);
      if (error) throw Error(error.message);
      toast.success("Se inició sesión correctamente");
      reset();
      navigate("/finanzas");
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
            Iniciar sesión
          </CardTitle>
          <CardAction>
            <Button
              onClick={handleSwitch}
              variant={"link"}
              className="cursor-pointer"
              type="button"
            >
              Crear cuenta
            </Button>
          </CardAction>
        </CardHeader>
        <CardDescription className="text-md px-4">
          Rellena los siguientes campos para iniciar sesión.
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
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3 bg-transparent backdrop-blur-xl">
          <Button
            className="w-full cursor-pointer transition-all active:scale-95"
            variant={"default"}
          >
            Iniciar sesión
          </Button>
          <Button
            className="w-full cursor-pointer transition-all active:scale-95"
            variant={"secondary"}
            type="button"
            onClick={() => {
              loginWithGoogle();
            }}
          >
            <svg
              className="w-4 h-4 me-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                clip-rule="evenodd"
              />
            </svg>
            Iniciar con Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

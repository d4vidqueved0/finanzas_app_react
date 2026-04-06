import z from "zod";

export const Registro = z.object({
  titulo: z.string().trim().min(1, "No puede quedar vacio este campo."),
  valor: z
    .number("Ingrese un numero.")
    .min(1, "No puede quedar vacio este campo."),
  tipo: z.enum(["Ingreso", "Egreso"], "Selecciona una de las opciones."),
  etiquetas: z
    .array(
      z.object({
        etiqueta: z.string().min(1, "Este campo no puede quedar vacio."),
      }),
    )
    .max(5, "Maximo de 5 etiquetas por registro."),
});

export type RegistroType = z.infer<typeof Registro>;

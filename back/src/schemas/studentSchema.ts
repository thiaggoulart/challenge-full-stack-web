import { z } from "zod";

export const studentSchema = z.object({
  name: z.string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O nome pode ter no máximo 100 caracteres." }),
  email: z.string()
    .email({ message: "Formato de e-mail inválido." }),
  ra: z.string()
    .regex(/^[A-Z0-9]{6,12}$/, { message: "RA deve ter entre 6 e 12 caracteres, apenas letras e números." }),
  cpf: z.string()
    .regex(/^\d{11}$/, { message: "CPF deve conter exatamente 11 dígitos numéricos." })
});

export type StudentInput = z.infer<typeof studentSchema>;

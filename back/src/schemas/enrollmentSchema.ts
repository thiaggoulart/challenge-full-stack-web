import { z } from "zod";

export const enrollmentSchema = z.object({
  studentRa: z.union([
    z.string()
      .min(6, { message: "O RA do aluno deve ter pelo menos 6 caracteres" })
      .max(12, { message: "O RA do aluno deve ter no máximo 12 caracteres" })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "O RA do aluno deve conter apenas letras e números",
      }),
    z.undefined().refine(() => false, {
      message: "O RA do aluno é obrigatório",
    }),
  ]),

  course: z.string()
    .min(3, { message: "O nome do curso deve ter pelo menos 3 caracteres" })
    .optional()
    .refine((val) => val !== undefined && val.trim().length > 0, {
      message: "O curso é obrigatório",
    }),
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

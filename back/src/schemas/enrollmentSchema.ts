import { z } from "zod";

export const enrollmentSchema = z.object({
  studentId: z.any()
    .refine((val) => typeof val === "number" && val > 0, {
      message: "O ID do aluno é obrigatório e deve ser um número positivo."
    }),
  course: z.string()
    .nonempty("O curso é obrigatório.")
    .min(3, { message: "O nome do curso deve ter pelo menos 3 caracteres." })
    .default("Programação Web")
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

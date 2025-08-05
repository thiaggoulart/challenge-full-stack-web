import { enrollmentSchema } from "../schemas/enrollmentSchema";

describe("Validação de Matrículas (Zod)", () => {
  it("Deve aceitar matrícula válida", () => {
    const validEnrollment = { studentId: 1, course: "Programação Web" };
    const result = enrollmentSchema.safeParse(validEnrollment);
    expect(result.success).toBe(true);
  });

  it("Deve rejeitar matrícula sem ID de aluno", () => {
    const invalidEnrollment = { course: "Programação Web" };
    const result = enrollmentSchema.safeParse(invalidEnrollment);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message)
        .toBe("O ID do aluno é obrigatório e deve ser um número positivo.");
    }
  });
});

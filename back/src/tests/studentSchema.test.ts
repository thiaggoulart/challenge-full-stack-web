import { studentSchema } from "../schemas/studentSchema";

describe("Validação de Alunos (Zod)", () => {
  it("Deve aceitar aluno válido", () => {
    const validStudent = {
      name: "Thiago Goulart",
      email: "thiago@gmail.com",
      ra: "ABC12345",
      cpf: "12345678901"
    };

    const result = studentSchema.safeParse(validStudent);
    expect(result.success).toBe(true);
  });

  it("Deve rejeitar CPF inválido", () => {
    const invalidStudent = {
      name: "Thiago",
      email: "thiago@gmail.com",
      ra: "ABC12345",
      cpf: "123"
    };

    const result = studentSchema.safeParse(invalidStudent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("CPF deve conter exatamente 11 dígitos numéricos.");
    }
  });
});

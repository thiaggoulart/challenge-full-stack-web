import { studentSchema } from "../schemas/studentSchema";

describe("Student Validation (Zod)", () => {
  it("should accept a valid student", () => {
    const validStudent = {
      name: "Thiago Goulart",
      email: "thiago@gmail.com",
      ra: "ABC12345",
      cpf: "12345678901"
    };

    const result = studentSchema.safeParse(validStudent);
    expect(result.success).toBe(true);
  });

  it("should reject an invalid CPF", () => {
    const invalidStudent = {
      name: "Thiago",
      email: "thiago@gmail.com",
      ra: "ABC12345",
      cpf: "123"
    };

    const result = studentSchema.safeParse(invalidStudent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("CPF deve conter exatamente 11 dígitos numéricos");
    }
  });
});

import { enrollmentSchema } from "../schemas/enrollmentSchema";

describe("Enrollment Validation (Zod)", () => {
  it("should accept a valid enrollment", () => {
    const validEnrollment = { studentRa: "RA123456", course: "Programação Web" };
    const result = enrollmentSchema.safeParse(validEnrollment);
    expect(result.success).toBe(true);
  });

  it("should reject an enrollment without RA", () => {
    const invalidEnrollment = { course: "Programação Web" };
    const result = enrollmentSchema.safeParse(invalidEnrollment);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("O RA do aluno é obrigatório");
    }
  });

  it("should reject an enrollment with short RA", () => {
    const invalidEnrollment = { studentRa: "RA1", course: "Programação Web" };
    const result = enrollmentSchema.safeParse(invalidEnrollment);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue =>
        issue.message.includes("O RA do aluno deve ter pelo menos 6 caracteres")
      )).toBe(true);
    }
  });

  it("should reject an enrollment with empty course", () => {
    const invalidEnrollment = { studentRa: "RA123456", course: "" };
    const result = enrollmentSchema.safeParse(invalidEnrollment);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("O nome do curso deve ter pelo menos 3 caracteres");
    }
  });
});

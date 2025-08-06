import { createEnrollment, getAllEnrollments, getEnrollmentById, deleteEnrollment } from "../controllers/enrollmentController";
import { Enrollment } from "../models/Enrollment";
import { Student } from "../models/Student";
import { Request, Response } from "express";
import { validEnrollmentData } from "./fixtures/enrollmentFixture";

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Enrollment Controller", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("createEnrollment", () => {
        it("should create enrollment if student exists", async () => {
            const req = { body: validEnrollmentData } as Request;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockResolvedValue({ ra: validEnrollmentData.studentRa } as any);
            jest.spyOn(Enrollment, "create").mockResolvedValue(validEnrollmentData as any);

            await createEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
        });

        it("should return 404 if student does not exist", async () => {
            const req = { body: validEnrollmentData } as Request;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockResolvedValue(null);

            await createEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
        });

        it("should return Zod validation errors when RA is missing", async () => {
            const req = { body: { course: "" } } as any;
            const res = mockResponse();

            await createEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: expect.arrayContaining([
                    "O RA do aluno é obrigatório",
                    "O curso é obrigatório",
                    "O nome do curso deve ter pelo menos 3 caracteres"
                ])
            });
        });

        it("should return Zod validation errors when RA is invalid", async () => {
            const req = { body: { studentRa: "RA1", course: "" } } as any; // RA inválido
            const res = mockResponse();

            await createEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: expect.arrayContaining([
                    "O RA do aluno deve ter pelo menos 6 caracteres",
                    "O curso é obrigatório",
                    "O nome do curso deve ter pelo menos 3 caracteres"
                ])
            });
        });
    });

    describe("getAllEnrollments", () => {
        it("should return all enrollments", async () => {
            const req = {} as Request;
            const res = mockResponse();

            jest.spyOn(Enrollment, "findAll").mockResolvedValue([validEnrollmentData] as any);

            await getAllEnrollments(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ id: 1 })
            ]));
        });

        it("should handle Sequelize errors with generic message", async () => {
            const req = {} as Request;
            const res = mockResponse();

            jest.spyOn(Enrollment, "findAll").mockImplementation(() => { throw new Error("DB error"); });

            await getAllEnrollments(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro ao listar matrículas" });
        });
    });

    describe("getEnrollmentById", () => {
        it("should return enrollment by ID", async () => {
            const req = { params: { id: "1" } } as any;
            const res = mockResponse();

            jest.spyOn(Enrollment, "findByPk").mockResolvedValue(validEnrollmentData as any);

            await getEnrollmentById(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
        });

        it("should return 404 if enrollment not found", async () => {
            const req = { params: { id: "99" } } as any;
            const res = mockResponse();

            jest.spyOn(Enrollment, "findByPk").mockResolvedValue(null);

            await getEnrollmentById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Matrícula não encontrada" });
        });

        it("should handle Sequelize errors with generic message", async () => {
            const req = { params: { id: "1" } } as any;
            const res = mockResponse();

            jest.spyOn(Enrollment, "findByPk").mockImplementation(() => { throw new Error("DB error"); });

            await getEnrollmentById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar matrícula" });
        });
    });

    it("should return 400 with Zod errors for invalid enrollment data", async () => {
        const req = { body: { course: "" } } as any;
        const res = mockResponse();

        await createEnrollment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: expect.arrayContaining([
                "O RA do aluno é obrigatório",
                "O curso é obrigatório",
                "O nome do curso deve ter pelo menos 3 caracteres",
            ]),
        });
    });


    it("should return 404 if student does not exist", async () => {
        const req = { body: validEnrollmentData } as any;
        const res = mockResponse();

        jest.spyOn(Student, "findOne").mockResolvedValue(null);

        await createEnrollment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
    });

    it("should return generic error if Enrollment.create throws", async () => {
        const req = { body: validEnrollmentData } as any;
        const res = mockResponse();

        jest.spyOn(Student, "findOne").mockResolvedValue({ ra: validEnrollmentData.studentRa } as any);
        jest.spyOn(Enrollment, "create").mockImplementation(() => { throw new Error("DB error"); });

        await createEnrollment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao criar matrícula" });
    });

    it("should return generic error if getAllEnrollments throws", async () => {
        const req = {} as Request;
        const res = mockResponse();

        jest.spyOn(Enrollment, "findAll").mockImplementation(() => { throw new Error("DB error"); });

        await getAllEnrollments(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao listar matrículas" });
    });

    it("should return generic error if getEnrollmentById throws", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();

        jest.spyOn(Enrollment, "findOne").mockImplementation(() => { throw new Error("DB error"); });

        await getEnrollmentById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar matrícula" });
    });

    it("should return 400 for unexpected error on createEnrollment", async () => {
        const req = { body: validEnrollmentData } as any;
        const res = mockResponse();

        jest.spyOn(Student, "findOne").mockImplementation(() => { throw new Error("DB error"); });

        await createEnrollment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao criar matrícula" });
    });

    it("should return 500 for unexpected error on getAllEnrollments", async () => {
        const req = {} as Request;
        const res = mockResponse();

        jest.spyOn(Enrollment, "findAll").mockImplementation(() => { throw new Error("DB error"); });

        await getAllEnrollments(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao listar matrículas" });
    });

    it("should return 400 for unexpected error on getEnrollmentById", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();

        jest.spyOn(Enrollment, "findByPk").mockImplementation(() => { throw new Error("DB error"); });

        await getEnrollmentById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar matrícula" });
    });

    it("should return 400 if course is missing", async () => {
        const req = { body: { studentRa: "RA123456" } } as any;
        const res = mockResponse();

        jest.spyOn(Student, "findOne").mockResolvedValue({ ra: "RA123456" } as any);

        await createEnrollment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["O curso é obrigatório"],
        });
    });

    describe("Enrollment Controller - Delete", () => {
        it("should delete enrollment if it exists", async () => {
            const req = { params: { id: "1" } } as unknown as Request;
            const res = mockResponse();
            const destroyMock = jest.fn();

            jest.spyOn(Enrollment, "findByPk").mockResolvedValue({ id: 1, destroy: destroyMock } as any);

            await deleteEnrollment(req, res);

            expect(destroyMock).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: "Matrícula deletada com sucesso" });
        });

        it("should return 404 if enrollment does not exist", async () => {
            const req = { params: { id: "99" } } as unknown as Request;
            const res = mockResponse();

            jest.spyOn(Enrollment, "findByPk").mockResolvedValue(null);

            await deleteEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Matrícula não encontrada" });
        });

        it("should handle unexpected errors", async () => {
            const req = { params: { id: "1" } } as unknown as Request;
            const res = mockResponse();

            jest.spyOn(Enrollment, "findByPk").mockImplementation(() => {
                throw new Error("DB error");
            });

            await deleteEnrollment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro ao deletar matrícula" });
        });
    });

    it("should return 400 if student is already enrolled in the same course", async () => {
        const req = {
            body: {
                studentRa: "RA123456",
                course: "Ciência da Computação",
            },
        } as any;

        const res = mockResponse();

        jest.spyOn(Student, "findOne").mockResolvedValue({ ra: "RA123456" } as any);
        jest.spyOn(Enrollment, "findOne").mockResolvedValue({ id: 1 } as any);

        await createEnrollment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Este aluno já está matriculado neste curso",
        });
    });
});

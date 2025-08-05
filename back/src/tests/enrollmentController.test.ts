import {
    createEnrollment,
    getAllEnrollments,
    getEnrollmentById
} from "../controllers/enrollmentController";
import { Enrollment } from "../models/Enrollment";
import { Student } from "../models/Student";
import { Request, Response } from "express";

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Enrollment Controller", () => {
    beforeEach(() => jest.clearAllMocks());

    it("Deve criar matrícula se aluno existir", async () => {
        const req = { body: { studentId: 1, course: "Programação Web" } } as Request;
        const res = mockResponse();

        jest.spyOn(Student, "findByPk").mockResolvedValue({ id: 1 } as any);
        jest.spyOn(Enrollment, "create").mockResolvedValue({ id: 1, ...req.body } as any);

        await createEnrollment(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it("Deve retornar erro se aluno não existir", async () => {
        const req = { body: { studentId: 99, course: "Programação Web" } } as Request;
        const res = mockResponse();
        jest.spyOn(Student, "findByPk").mockResolvedValue(null);

        await createEnrollment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
    });

    it("Deve retornar erro de validação do Zod ao criar matrícula", async () => {
        const req = { body: { course: "" } } as any; // inválido: sem studentId
        const res = mockResponse();

        await createEnrollment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: expect.arrayContaining([
                "O ID do aluno é obrigatório e deve ser um número positivo."
            ])
        });
    });

    it("Deve listar matrículas", async () => {
        const req = {} as Request;
        const res = mockResponse();
        jest
            .spyOn(Enrollment, "findAll")
            .mockResolvedValue([{ id: 1, course: "Programação Web" }] as any);

        await getAllEnrollments(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([expect.objectContaining({ id: 1 })])
        );
    });

    it("Deve buscar matrícula por ID", async () => {
        const req: Partial<Request> = { params: { id: "1" } };
        const res = mockResponse();

        jest.spyOn(Enrollment, "findByPk")
            .mockResolvedValue({ id: 1, course: "Programação Web" } as any);

        await getEnrollmentById(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it("Deve retornar erro ao buscar matrícula inexistente", async () => {
        const req: Partial<Request> = { params: { id: "99" } };
        const res = mockResponse();

        jest.spyOn(Enrollment, "findByPk").mockResolvedValue(null);

        await getEnrollmentById(req as Request, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Matricula não encontrada" });
    });


    it("Deve buscar matrícula por ID", async () => {
        const req: Partial<Request> = { params: { id: "1" } };
        const res = mockResponse();

        jest.spyOn(Enrollment, "findByPk").mockResolvedValue({ id: 1, course: "Programação Web" } as any);

        await getEnrollmentById(req as Request, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

});
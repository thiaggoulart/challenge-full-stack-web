import { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } from "../controllers/studentController";
import { Student } from "../models/Student";
import { Request, Response } from "express";

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Student Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Deve criar aluno válido", async () => {
        const req = { body: { name: "Thiago", email: "thiago@test.com", ra: "ABC123", cpf: "12345678901" } } as Request;
        const res = mockResponse();

        jest.spyOn(Student, "create").mockResolvedValue({ id: 1, ...req.body } as any);

        await createStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it("Deve falhar ao criar aluno inválido (erro do Zod)", async () => {
        const req = { body: { cpf: "123" } } as any; // faltando campos obrigatórios
        const res = mockResponse();

        await createStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: expect.arrayContaining(["CPF deve conter exatamente 11 dígitos numéricos."])
        });
    });

    it("Deve listar alunos", async () => {
        const req = {} as Request;
        const res = mockResponse();
        jest.spyOn(Student, "findAll").mockResolvedValue([{ id: 1, name: "Teste" }] as any);

        await getAllStudents(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 1 })]));
    });

    it("Deve buscar aluno por ID", async () => {
        const req = { params: { id: "1" } } as unknown as Request;
        const res = mockResponse();
        jest.spyOn(Student, "findByPk").mockResolvedValue({ id: 1 } as any);

        await getStudentById(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it("Deve retornar erro ao buscar aluno inexistente", async () => {
        const req = { params: { id: "99" } } as unknown as Request;
        const res = mockResponse();
        jest.spyOn(Student, "findByPk").mockResolvedValue(null);

        await getStudentById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
    });

    it("Deve atualizar aluno válido", async () => {
        const req = { params: { id: "1" }, body: { name: "Novo Nome", email: "novo@test.com" } } as any;
        const res = mockResponse();

        jest.spyOn(Student, "findByPk").mockResolvedValue({
            id: 1,
            update: jest.fn().mockImplementation(function (this: any, data: any) {
                Object.assign(this, data);
                return this;
            })
        } as any);

        await updateStudent(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: 1,
            name: "Novo Nome",
            email: "novo@test.com"
        }));
    });

    it("Deve falhar ao atualizar aluno inexistente", async () => {
        const req = { params: { id: "99" }, body: { name: "Novo" } } as any;
        const res = mockResponse();
        jest.spyOn(Student, "findByPk").mockResolvedValue(null);

        await updateStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
    });

    it("Deve falhar ao atualizar aluno com dados inválidos (erro do Zod)", async () => {
        const req = { params: { id: "1" }, body: { email: "invalido" } } as any;
        const res = mockResponse();

        jest.spyOn(Student, "findByPk").mockResolvedValue({ update: jest.fn() } as any);

        await updateStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: expect.arrayContaining(["Formato de e-mail inválido."])
        });
    });

    it("Deve deletar aluno existente", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();
        jest.spyOn(Student, "findByPk").mockResolvedValue({ id: 1, destroy: jest.fn() } as any);

        await deleteStudent(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: "Aluno deletado com sucesso" });
    });

    it("Deve falhar ao deletar aluno inexistente", async () => {
        const req = { params: { id: "99" } } as any;
        const res = mockResponse();
        jest.spyOn(Student, "findByPk").mockResolvedValue(null);

        await deleteStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
    });

    it("Deve capturar erro no delete (exceção genérica)", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();
        jest.spyOn(Student, "findByPk").mockImplementation(() => { throw new Error("DB error"); });

        await deleteStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });

    it("Deve capturar erro no getStudentById (exceção genérica)", async () => {
        const req = { params: { id: "1" } } as any;
        const res = mockResponse();
        jest.spyOn(Student, "findByPk").mockImplementation(() => { throw new Error("Falha inesperada"); });

        await getStudentById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Falha inesperada" });
    });
});

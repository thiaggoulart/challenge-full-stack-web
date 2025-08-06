import {
    createStudent,
    updateStudent,
    getAllStudents,
    deleteStudent,
    getStudentByRa,
    searchStudents
} from "../controllers/studentController";
import { Student } from "../models/Student";
import { Request, Response } from "express";
import { validStudentData, invalidStudentData, partialStudentUpdate } from "./fixtures/studentFixture";

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Student Controller", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("createStudent", () => {
        it("should create a valid student", async () => {
            const req = { body: validStudentData } as Request;
            const res = mockResponse();

            jest.spyOn(Student, "create").mockResolvedValue({ id: 1, ...validStudentData } as any);

            await createStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
        });

        it("should return Zod validation errors for invalid data", async () => {
            const req = { body: invalidStudentData } as Request;
            const res = mockResponse();

            await createStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: expect.arrayContaining([
                    expect.stringContaining("RA deve ter entre 6 e 12 caracteres"),
                    expect.stringContaining("CPF deve conter exatamente 11 dígitos numéricos")
                ])
            });
        });

        it("should return generic error for Sequelize failure", async () => {
            const req = { body: validStudentData } as Request;
            const res = mockResponse();

            jest.spyOn(Student, "create").mockRejectedValue(new Error("DB error"));

            await createStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado ao criar aluno" });
        });
    });

    describe("updateStudent", () => {
        it("should update student successfully", async () => {
            const req = { params: { ra: validStudentData.ra }, body: partialStudentUpdate } as any;
            const res = mockResponse();

            const mockStudent = {
                ...validStudentData,
                update: jest.fn().mockImplementation(function (this: any, data) {
                    Object.assign(this, data);
                    return Promise.resolve(this);
                }),
            };

            jest.spyOn(Student, "findOne").mockResolvedValue(mockStudent as any);

            await updateStudent(req, res);

            expect(mockStudent.update).toHaveBeenCalledWith(partialStudentUpdate);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining(partialStudentUpdate));
        });

        it("should return 404 if student not found for update", async () => {
            const req = { params: { ra: "NOTFOUND" }, body: partialStudentUpdate } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockResolvedValue(null);

            await updateStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
        });

        it("should return Zod validation errors when updating with invalid data", async () => {
            const req = { params: { ra: validStudentData.ra }, body: invalidStudentData } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockResolvedValue({ update: jest.fn() } as any);

            await updateStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: expect.arrayContaining([
                    expect.stringContaining("Formato de e-mail inválido"),
                    expect.stringContaining("CPF deve conter exatamente 11 dígitos numéricos")
                ])
            });
        });

        it("should return generic error for Sequelize failure on update", async () => {
            const req = { params: { ra: validStudentData.ra }, body: partialStudentUpdate } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockImplementation(() => { throw new Error("DB error"); });

            await updateStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado ao atualizar aluno" });
        });
    });

    describe("getAllStudents", () => {
        it("should list all students", async () => {
            const req = {} as Request;
            const res = mockResponse();

            jest.spyOn(Student, "findAll").mockResolvedValue([validStudentData] as any);

            await getAllStudents(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(validStudentData)]));
        });

        it("should return error when Sequelize fails", async () => {
            const req = {} as Request;
            const res = mockResponse();

            jest.spyOn(Student, "findAll").mockRejectedValue(new Error("DB error"));

            await getAllStudents(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro ao listar alunos" });
        });
    });

    describe("deleteStudent", () => {
        it("should delete an existing student", async () => {
            const req = { params: { ra: validStudentData.ra } } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockResolvedValue({ ...validStudentData, destroy: jest.fn() } as any);

            await deleteStudent(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: "Aluno deletado com sucesso" });
        });

        it("should return 404 if student not found for delete", async () => {
            const req = { params: { ra: "NOTFOUND" } } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockResolvedValue(null);

            await deleteStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
        });

        it("should return generic error for Sequelize failure on delete", async () => {
            const req = { params: { ra: validStudentData.ra } } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockImplementation(() => { throw new Error("DB error"); });

            await deleteStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado ao deletar aluno" });
        });
    });

    describe("getStudentByRa", () => {
        it("should return a student by RA", async () => {
            const req = { params: { ra: validStudentData.ra } } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockResolvedValue(validStudentData as any);

            await getStudentByRa(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining(validStudentData));
        });

        it("should return 404 if student not found", async () => {
            const req = { params: { ra: "NOTFOUND" } } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockResolvedValue(null);

            await getStudentByRa(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
        });

        it("should return generic error for Sequelize failure on getStudentByRa", async () => {
            const req = { params: { ra: validStudentData.ra } } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findOne").mockImplementation(() => { throw new Error("DB error"); });

            await getStudentByRa(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado ao buscar aluno" });
        });
    });

    describe("searchStudents", () => {
        it("should return students matching query", async () => {
            const req = { query: { query: "João" } } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findAll").mockResolvedValue([validStudentData] as any);

            await searchStudents(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(validStudentData)]));
        });

        it("should return 400 if no query parameter provided", async () => {
            const req = { query: {} } as any;
            const res = mockResponse();

            await searchStudents(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Parâmetro de busca é obrigatório" });
        });

        it("should return generic error for Sequelize failure on search", async () => {
            const req = { query: { query: "João" } } as any;
            const res = mockResponse();

            jest.spyOn(Student, "findAll").mockImplementation(() => { throw new Error("DB error"); });

            await searchStudents(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Erro inesperado na busca de alunos" });
        });
    });

    describe("Unique Constraint", () => {
        it("should return 400 if email is duplicated", async () => {
            const req = {
                body: {
                    name: "Duplicate User",
                    email: "duplicate@example.com",
                    ra: "RA123456",
                    cpf: "12345678901",
                },
            } as Request;

            const res = mockResponse();

            const error = {
                name: "SequelizeUniqueConstraintError",
                errors: [{ path: "email" }],
            };

            jest.spyOn(Student, "create").mockRejectedValue(error as any);

            await createStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Este e-mail já está cadastrado",
            });
        });

        it("should return 400 if RA is duplicated", async () => {
            const req = {
                body: {
                    name: "Duplicate RA",
                    email: "ra@example.com",
                    ra: "RA654321",
                    cpf: "12345678902",
                },
            } as Request;

            const res = mockResponse();

            const error = {
                name: "SequelizeUniqueConstraintError",
                errors: [{ path: "ra" }],
            };

            jest.spyOn(Student, "create").mockRejectedValue(error as any);

            await createStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Este RA já está cadastrado",
            });
        });

        it("should return 400 if CPF is duplicated", async () => {
            const req = {
                body: {
                    name: "Duplicate CPF",
                    email: "cpf@example.com",
                    ra: "RA789123",
                    cpf: "12345678903",
                },
            } as Request;

            const res = mockResponse();

            const error = {
                name: "SequelizeUniqueConstraintError",
                errors: [{ path: "cpf" }],
            };

            jest.spyOn(Student, "create").mockRejectedValue(error as any);

            await createStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: "Este CPF já está cadastrado",
            });
        });
    });
});

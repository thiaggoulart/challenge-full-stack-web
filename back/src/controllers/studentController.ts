import { Request, Response } from "express";
import { Op } from "sequelize";
import { Student } from "../models/Student";
import { studentSchema } from "../schemas/studentSchema";
import { ZodError } from "zod";

export const createStudent = async (req: Request, res: Response) => {
  try {
    console.log("DADOS PARA PARSE:", req.body);

    const parsedData = studentSchema.parse(req.body);
    const student = await Student.create(parsedData);
    return res.status(201).json(student);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.issues.map((i) => i.message),
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors?.[0]?.path;
      let message = "Valor duplicado para um campo único";

      if (field === "email") {
        message = "Este e-mail já está cadastrado";
      } else if (field === "ra") {
        message = "Este RA já está cadastrado";
      } else if (field === "cpf") {
        message = "Este CPF já está cadastrado";
      }

      return res.status(400).json({ error: message });
    }
    
    return res.status(400).json({ error: "Erro inesperado ao criar aluno" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { ra } = req.params;
    const student = await Student.findOne({ where: { ra } });

    if (!student) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const parsedData = studentSchema.partial().parse(req.body);
    await student.update(parsedData);

    return res.json(student);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.issues.map((i) => i.message),
      });
    }
    return res.status(400).json({ error: "Erro inesperado ao atualizar aluno" });
  }
};

export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await Student.findAll();
    return res.json(students);
  } catch {
    return res.status(500).json({ error: "Erro ao listar alunos" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { ra } = req.params;
    const student = await Student.findOne({ where: { ra } });

    if (!student) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    await student.destroy();
    return res.json({ message: "Aluno deletado com sucesso" });
  } catch {
    return res.status(400).json({ error: "Erro inesperado ao deletar aluno" });
  }
};

export const getStudentByRa = async (req: Request, res: Response) => {
  try {
    const { ra } = req.params;
    const student = await Student.findOne({ where: { ra } });

    if (!student) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    return res.json(student);
  } catch {
    return res.status(400).json({ error: "Erro inesperado ao buscar aluno" });
  }
};

export const searchStudents = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Parâmetro de busca é obrigatório" });
    }

    const students = await Student.findAll({
      where: {
        [Op.or]: [
          { ra: { [Op.iLike]: `%${query}%` } },
          { name: { [Op.iLike]: `%${query}%` } },
          { cpf: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });

    return res.json(students);
  } catch (error: any) {
    return res.status(400).json({ error: "Erro inesperado na busca de alunos" });
  }
};

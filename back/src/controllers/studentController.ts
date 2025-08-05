import { Request, Response } from "express";
import { Student } from "../models/Student";
import { studentSchema } from "../schemas/studentSchema";
import { ZodError } from "zod";

export const createStudent = async (req: Request, res: Response) => {
  try {
    const parsedData = studentSchema.parse(req.body);
    const student = await Student.create(parsedData);
    return res.status(201).json(student);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.issues.map((i) => i.message)
      });
    }
    return res.status(400).json({ error: error.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const parsedData = studentSchema.partial().parse(req.body);
    await student.update(parsedData);

    return res.json(student);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.issues.map((i) => i.message)
      });
    }
    return res.status(400).json({ error: error.message });
  }
};

export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await Student.findAll();
    return res.json(students);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    await student.destroy();
    return res.json({ message: "Aluno deletado com sucesso" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    return res.json(student);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

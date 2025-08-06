import { Request, Response } from "express";
import { Enrollment } from "../models/Enrollment";
import { Student } from "../models/Student";
import { enrollmentSchema } from "../schemas/enrollmentSchema";
import { ZodError } from "zod";

export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const parsedData = enrollmentSchema.parse(req.body);

    const student = await Student.findOne({ where: { ra: parsedData.studentRa } });
    if (!student) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: {
        studentRa: parsedData.studentRa,
        course: parsedData.course,
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        error: "Este aluno já está matriculado neste curso",
      });
    }

    const enrollment = await Enrollment.create({
      studentRa: student.ra,
      course: parsedData.course!
    });
    return res.status(201).json(enrollment);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.issues.map(issue => issue.message)
      });
    }

    return res.status(400).json({ error: "Erro ao criar matrícula" });
  }
};

export const getAllEnrollments = async (_req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.findAll();
    return res.json(enrollments);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar matrículas" });
  }
};

export const getEnrollmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ error: "Matrícula não encontrada" });
    }

    return res.json(enrollment);
  } catch (error) {
    return res.status(400).json({ error: "Erro ao buscar matrícula" });
  }
};

export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ error: "Matrícula não encontrada" });
    }

    await enrollment.destroy();
    return res.json({ message: "Matrícula deletada com sucesso" });
  } catch (error) {
    return res.status(400).json({ error: "Erro ao deletar matrícula" });
  }
};
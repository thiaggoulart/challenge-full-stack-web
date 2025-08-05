import { Request, Response } from "express";
import { Enrollment } from "../models/Enrollment";
import { Student } from "../models/Student";
import { enrollmentSchema } from "../schemas/enrollmentSchema";
import { ZodError } from "zod";

export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const parsedData = enrollmentSchema.parse(req.body);

    const student = await Student.findByPk(parsedData.studentId);
    if (!student) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const enrollment = await Enrollment.create(parsedData);
    return res.status(201).json(enrollment);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: error.issues.map((i) => i.message)
      });
    }
    return res.status(400).json({ error: error.message });
  }
};

export const getAllEnrollments = async (_req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.findAll({ include: Student });
    return res.json(enrollments);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEnrollmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id, { include: Student });

    if (!enrollment) {
      return res.status(404).json({ error: "Matricula não encontrada" });
    }

    return res.json(enrollment);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

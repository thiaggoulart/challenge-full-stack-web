import { Router } from "express";
import { createEnrollment, getAllEnrollments, getEnrollmentById, deleteEnrollment } from "../controllers/enrollmentController";

const router = Router();

router.post("/", createEnrollment);
router.get("/", getAllEnrollments);
router.get("/:id", getEnrollmentById);
router.delete("/:id", deleteEnrollment);

export default router;
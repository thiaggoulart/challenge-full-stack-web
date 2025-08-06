import { Router } from "express";
import { 
  createStudent, 
  updateStudent, 
  getAllStudents, 
  deleteStudent, 
  getStudentByRa, 
  searchStudents 
} from "../controllers/studentController";

const router = Router();

router.post("/", createStudent);
router.get("/", getAllStudents);
router.get("/search", searchStudents);
router.get("/:ra", getStudentByRa);
router.put("/:ra", updateStudent);
router.delete("/:ra", deleteStudent);

export default router;

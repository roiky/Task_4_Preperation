import { Router } from "express";
import { createLecturer, getAllLecturers, deleteLecturer } from "../controllers/lecturers.controller";

const router = Router();

router.post("/", createLecturer);
router.get("/", getAllLecturers);
router.delete("/:id", deleteLecturer);

export default router;
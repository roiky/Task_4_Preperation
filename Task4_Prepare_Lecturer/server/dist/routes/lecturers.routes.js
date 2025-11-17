"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lecturers_controller_1 = require("../controllers/lecturers.controller");
const router = (0, express_1.Router)();
router.post("/", lecturers_controller_1.createLecturer);
router.get("/", lecturers_controller_1.getAllLecturers);
router.delete("/:id", lecturers_controller_1.deleteLecturer);
exports.default = router;

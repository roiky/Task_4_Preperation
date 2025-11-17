import { Request, Response, NextFunction } from "express";
import * as service from "../services/lecturers.service.my";
import { createLecturerSchema } from "../utils/zodSchemas";

export async function createLecturer(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = createLecturerSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ message: `Invalid Lecturer Payload!` });

        const { name, skills } = parsed.data;

        const existLecturer = await service.findByNameInsensitive(name);
        if (existLecturer) return res.status(400).json({ message: `Lecturer Already Exist [ID: ${existLecturer.id}]` });

        //if passed validations - we will create the lecturer!
        const LecturerID = await service.createLecturer({ name, skills });
        const createdCheck = await service.findById(LecturerID);

        if (!createdCheck) return res.status(500).json({ message: `Failed to validate lecturer creation [ID:${LecturerID}]` });

        return res.status(201).json(createdCheck);
    } catch (err) {
        next(err);
    }
}

export async function getAllLecturers(_req: Request, res: Response, next: NextFunction) {
    try {
        const lecturersList = await service.findAll();
        return res.status(200).json(lecturersList);
    } catch (err) {
        next(err);
    }
}

export async function deleteLecturer(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
        const deleteOK = await service.deleteById(id);

        if (!deleteOK) return res.status(400).json({ message: `failed to delete lecturer [ID:${id}]` });
        return res.status(200).json({ message: `Lecturer ID ${id} deleted!` });
    } catch (err) {
        next(err);
    }
}

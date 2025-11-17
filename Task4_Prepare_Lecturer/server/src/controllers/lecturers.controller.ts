import { Request, Response, NextFunction } from "express";
import * as service from "../services/lecturers.service";
import { createLecturerSchema } from "../utils/zodSchemas";

export async function createLecturer(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = createLecturerSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ message: "Invalid payload", errors: parsed.error });

        const { name, skills } = parsed.data;

        const existing = await service.findByNameInsensitive(name);
        if (existing) return res.status(409).json({ message: "Lecturer already exists" });

        // createLecturer now returns insertId (number)
        const insertId = await service.createLecturer({ name, skills });
        const created = await service.findById(insertId);
        if (!created) return res.status(500).json({ message: "Failed to fetch created lecturer" });

        return res.status(201).json(created);
    } catch (err) {
        next(err);
    }
}

export async function getAllLecturers(_req: Request, res: Response, next: NextFunction) {
    try {
        const list = await service.findAll();
        return res.json(list);
    } catch (err) {
        next(err);
    }
}

export async function deleteLecturer(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
        const ok = await service.deleteById(id);
        if (!ok) return res.status(404).json({ message: "Not found" });
        return res.status(200).json({ message: `Lecturer ID ${id} deleted!` });
    } catch (err) {
        next(err);
    }
}

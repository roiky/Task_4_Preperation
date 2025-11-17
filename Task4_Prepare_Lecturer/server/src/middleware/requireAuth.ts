import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const auth = (req.headers["authorization"] as string) || "";
        if (!auth) return res.status(401).json({ message: "Unauthorized" });

        const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth; //our token is with "Bearer" but lets make it to cover all cases

        const secret = process.env.SECRET || "secret";
        const payload = jwt.verify(token, secret) as any;

        (req as any).user = {
            userId: payload.userId ?? payload.id,
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            role: payload.role,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

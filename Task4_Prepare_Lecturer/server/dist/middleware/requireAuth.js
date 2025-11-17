"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    var _a;
    try {
        const auth = req.headers["authorization"] || "";
        if (!auth)
            return res.status(401).json({ message: "Unauthorized" });
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth; //our token is with "Bearer" but lets make it to cover all cases
        const secret = process.env.SECRET || "secret";
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            userId: (_a = payload.userId) !== null && _a !== void 0 ? _a : payload.id,
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

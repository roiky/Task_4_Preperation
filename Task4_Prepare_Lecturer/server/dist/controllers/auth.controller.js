"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandler = registerHandler;
exports.loginHandler = loginHandler;
exports.setAdminHandler = setAdminHandler;
exports.getMeHandler = getMeHandler;
const zodSchemas_1 = require("../utils/zodSchemas");
const usersService = __importStar(require("../services/users.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";
function registerHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsed = zodSchemas_1.registerSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ message: "Validation error", details: parsed.error.message });
            }
            const { first_name, last_name, email, password } = parsed.data;
            if (yield usersService.isEmailExists(email)) {
                return res.status(409).json({ message: "Email already exists" });
            }
            const id = yield usersService.createUser({ first_name, last_name, email, password, role: "user" });
            return res.status(201).json({ id, message: "User registered" });
        }
        catch (err) {
            next(err);
        }
    });
}
function loginHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsed = zodSchemas_1.loginSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ message: "Validation error", details: parsed.error });
            }
            const { email, password } = parsed.data;
            const user = yield usersService.findUserByEmail(email);
            if (!user || !user.password_hash) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const ok = yield bcrypt_1.default.compare(password, user.password_hash);
            if (!ok)
                return res.status(401).json({ message: "Invalid credentials" });
            // token payload
            const payload = {
                userId: user.user_id,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            };
            const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
            return res.status(200).json({ token, user: payload });
        }
        catch (err) {
            next(err);
        }
    });
}
function setAdminHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userIdRaw = req.params.id;
            const id = Number(userIdRaw);
            if (!id || Number.isNaN(id) || id <= 0) {
                return res.status(400).json({ message: "Invalid user id" });
            }
            const user = yield usersService.findUserById(id);
            if (!user) {
                return res.status(404).json({ message: "User not exist" });
            }
            const updated = yield usersService.setUserAdmin(id);
            if (!updated) {
                return res.status(500).json({ message: "Failed to set user as admin" });
            }
            return res.status(200).json({ message: "User set to admin role", user: updated });
        }
        catch (err) {
            next(err);
        }
    });
}
function getMeHandler(req, res) {
    const user = req.user;
    if (!user)
        return res.status(401).json({ message: "Unauthorized" });
    return res.json({
        user: {
            userId: user.userId,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
        },
    });
}

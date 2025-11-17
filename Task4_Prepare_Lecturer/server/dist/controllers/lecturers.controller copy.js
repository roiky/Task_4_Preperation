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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLecturer = createLecturer;
exports.getAllLecturers = getAllLecturers;
exports.deleteLecturer = deleteLecturer;
const service = __importStar(require("../services/lecturers.service"));
const zodSchemas_1 = require("../utils/zodSchemas");
function createLecturer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsed = zodSchemas_1.createLecturerSchema.safeParse(req.body);
            if (!parsed.success)
                return res.status(400).json({ message: "Invalid payload", errors: parsed.error });
            const { name, skills } = parsed.data;
            const existing = yield service.findByNameInsensitive(name);
            if (existing)
                return res.status(409).json({ message: "Lecturer already exists" });
            // createLecturer now returns insertId (number)
            const insertId = yield service.createLecturer({ name, skills });
            const created = yield service.findById(insertId);
            if (!created)
                return res.status(500).json({ message: "Failed to fetch created lecturer" });
            return res.status(201).json(created);
        }
        catch (err) {
            next(err);
        }
    });
}
function getAllLecturers(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const list = yield service.findAll();
            return res.json(list);
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteLecturer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id))
                return res.status(400).json({ message: "Invalid id" });
            const ok = yield service.deleteById(id);
            if (!ok)
                return res.status(404).json({ message: "Not found" });
            return res.status(200).json({ message: `Lecturer ID ${id} deleted!` });
        }
        catch (err) {
            next(err);
        }
    });
}

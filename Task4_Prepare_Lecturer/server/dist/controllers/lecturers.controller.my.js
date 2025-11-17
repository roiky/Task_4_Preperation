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
const service = __importStar(require("../services/lecturers.service.my"));
const zodSchemas_1 = require("../utils/zodSchemas");
function createLecturer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsed = zodSchemas_1.createLecturerSchema.safeParse(req.body);
            if (!parsed.success)
                return res.status(400).json({ message: `Invalid Lecturer Payload!` });
            const { name, skills } = parsed.data;
            const existLecturer = yield service.findByNameInsensitive(name);
            if (existLecturer)
                return res.status(400).json({ message: `Lecturer Already Exist [ID: ${existLecturer.id}]` });
            //if passed validations - we will create the lecturer!
            const LecturerID = yield service.createLecturer({ name, skills });
            const createdCheck = yield service.findById(LecturerID);
            if (!createdCheck)
                return res.status(500).json({ message: `Failed to validate lecturer creation [ID:${LecturerID}]` });
            return res.status(201).json(createdCheck);
        }
        catch (err) {
            next(err);
        }
    });
}
function getAllLecturers(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lecturersList = yield service.findAll();
            return res.status(200).json(lecturersList);
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
            const deleteOK = yield service.deleteById(id);
            if (!deleteOK)
                return res.status(400).json({ message: `failed to delete lecturer [ID:${id}]` });
            return res.status(200).json({ message: `Lecturer ID ${id} deleted!` });
        }
        catch (err) {
            next(err);
        }
    });
}

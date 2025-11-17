"use strict";
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
exports.findAll = findAll;
exports.findByNameInsensitive = findByNameInsensitive;
exports.findById = findById;
exports.createLecturer = createLecturer;
exports.deleteById = deleteById;
const db_1 = __importDefault(require("../db"));
function findAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = yield (0, db_1.default)();
            const [rows] = yield pool.query(`SELECT id, name, skills_react, skills_node, skills_angular, skills_dotnet,
            skills_microservices, skills_microfrontends, skills_ai, skills_docker,
            created_at, updated_at
     FROM lecturers
     ORDER BY created_at DESC`);
            return rows;
        }
        catch (error) {
            console.error(`error while trying to get lecturers`);
            throw error;
        }
    });
}
function findByNameInsensitive(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = yield (0, db_1.default)();
            const [rows] = yield pool.query(`SELECT * FROM lecturers WHERE LOWER(name) = LOWER(?) LIMIT 1`, [name]);
            return rows[0];
        }
        catch (error) {
            console.error(`error while trying to get lecturers by name`);
            throw error;
        }
    });
}
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = yield (0, db_1.default)();
            const [rows] = yield pool.query(`SELECT * FROM lecturers WHERE id = ? LIMIT 1`, [id]);
            return rows[0];
        }
        catch (error) {
            console.error(`error while trying to get lecturers by ID`);
            throw error;
        }
    });
}
function createLecturer(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, db_1.default)();
            const sql = `
    INSERT INTO lecturers
      (name, skills_react, skills_node, skills_angular, skills_dotnet, skills_microservices, skills_microfrontends, skills_ai, skills_docker, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
            const params = [
                payload.name,
                payload.skills.react,
                payload.skills.node,
                payload.skills.angular,
                payload.skills.dotnet,
                payload.skills.microservices,
                payload.skills.microfrontends,
                payload.skills.ai,
                payload.skills.docker,
            ];
            const [result] = yield conn.execute(sql, params);
            return result.insertId;
        }
        catch (error) {
            console.error(`error while trying to create lecturer`);
            throw error;
        }
    });
}
function deleteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, db_1.default)();
            const sql = `DELETE FROM lecturers WHERE id = ?`;
            const params = [id];
            const [result] = yield conn.execute(sql, params);
            return result.affectedRows > 0;
        }
        catch (error) {
            console.error(`error while trying to delete lecturer by ID`);
            throw error;
        }
    });
}

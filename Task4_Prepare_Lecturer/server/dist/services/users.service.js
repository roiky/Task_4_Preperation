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
exports.isEmailExists = isEmailExists;
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.setUserAdmin = setUserAdmin;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../db"));
function isEmailExists(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield (0, db_1.default)();
        const [rows] = yield conn.execute("SELECT 1 FROM users WHERE email = ? LIMIT 1", [email]);
        return rows.length > 0;
    });
}
function createUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ first_name, last_name, email, password, role = "user", }) {
        const conn = yield (0, db_1.default)();
        const hashed = yield bcrypt_1.default.hash(password, 10);
        const [res] = yield conn.execute("INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)", [first_name, last_name, email, hashed, role]);
        return res.insertId;
    });
}
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield (0, db_1.default)();
        const [rows] = yield conn.execute("SELECT user_id, first_name, last_name, email, role, password_hash FROM vacations_app.users WHERE email = ? LIMIT 1", [email]);
        if (rows.length === 0)
            return null;
        return rows[0];
    });
}
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield (0, db_1.default)();
        const [rows] = yield conn.execute("SELECT user_id, first_name, last_name, email, role FROM vacations_app.users WHERE user_id = ? LIMIT 1", [id]);
        if (rows.length === 0)
            return null;
        return rows[0];
    });
}
function setUserAdmin(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield (0, db_1.default)();
        const [result] = yield conn.execute("UPDATE vacations_app.users SET role = 'admin' WHERE user_id = ?", [id]);
        if (!result || result.affectedRows === 0) {
            return null;
        }
        const [rows] = yield conn.execute("SELECT user_id, first_name, last_name, email, role, created_at FROM vacations_app.users WHERE user_id = ?", [id]);
        return rows && rows[0] ? rows[0] : null;
    });
}

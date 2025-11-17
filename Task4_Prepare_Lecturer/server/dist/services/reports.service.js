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
exports.getFollowersReport = getFollowersReport;
const db_1 = __importDefault(require("../db"));
function getFollowersReport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, db_1.default)();
            const sql = `
      SELECT vacation_id, destination, followers_count
      FROM vacations_app.vw_vacations_with_followers
      ORDER BY followers_count DESC
    `;
            const [rows] = yield conn.execute(sql);
            const mapped = (rows || []).map((r) => {
                var _a;
                return ({
                    vacation_id: Number(r.vacation_id),
                    destination: String(r.destination),
                    followers_count: Number((_a = r.followers_count) !== null && _a !== void 0 ? _a : 0),
                });
            });
            return mapped;
        }
        catch (err) {
            console.error("[REPORTS] getFollowersReport error:", err);
            throw err;
        }
    });
}

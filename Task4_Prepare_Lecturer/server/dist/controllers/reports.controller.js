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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowersJsonHandler = getFollowersJsonHandler;
exports.getFollowersCsvHandler = getFollowersCsvHandler;
const reports_service_1 = require("../services/reports.service");
function getFollowersJsonHandler(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, reports_service_1.getFollowersReport)();
            return res.status(200).json({ data });
        }
        catch (err) {
            console.error(err);
            next(err);
        }
    });
}
/**
 * Escape value for CSV:
 * - double-quote the field,
 * - double any internal quotes,
 * - if null/undefined -> empty string.
 */
function escapeCsvValue(v) {
    if (v === null || v === undefined)
        return "";
    const s = String(v);
    // replace " with "" then wrap in quotes
    return `"${s.replace(/"/g, '""')}"`;
}
/**
 * Build CSV content from ReportRow[].
 * First line = header, then rows.
 * We prepend BOM (\uFEFF) so Excel will detect UTF-8 correctly.
 */
function buildFollowersCsv(rows) {
    const headers = ["vacation_id", "destination", "followers_count"];
    const headerLine = headers.join(",");
    const dataLines = rows.map((r) => [r.vacation_id, r.destination, r.followers_count].map(escapeCsvValue).join(","));
    const csv = [headerLine, ...dataLines].join("\r\n");
    // prepend BOM for Excel / Windows CSV compatibility
    return "\uFEFF" + csv;
}
/**
 * GET /reports/followers.csv
 * returns CSV file for download
 */
function getFollowersCsvHandler(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rows = yield (0, reports_service_1.getFollowersReport)(); // returns ReportRow[]
            const csvContent = buildFollowersCsv(rows);
            // Set headers so browser downloads a file
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", 'attachment; filename="followers_report.csv"');
            return res.status(200).send(csvContent);
        }
        catch (err) {
            next(err);
        }
    });
}

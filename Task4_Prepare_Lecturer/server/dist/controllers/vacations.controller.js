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
exports.getAllVacationsHandler = getAllVacationsHandler;
exports.getActiveVacationsHandler = getActiveVacationsHandler;
exports.getUpcomingVacationsHandler = getUpcomingVacationsHandler;
exports.getFollowedVacationsHandler = getFollowedVacationsHandler;
exports.postFollowHandler = postFollowHandler;
exports.deleteFollowHandler = deleteFollowHandler;
exports.getAllVacationsAdminHandler = getAllVacationsAdminHandler;
const vacations_service_1 = require("../services/vacations.service");
function getAllVacationsHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const page = Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
            const pageSize = Number((_b = req.query.pageSize) !== null && _b !== void 0 ? _b : 10);
            const userId = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId) !== null && _d !== void 0 ? _d : null;
            const result = yield (0, vacations_service_1.getAllVacations)({ userId, page, pageSize });
            res.json({ data: result.rows, meta: { total: result.total, page: result.page, pageSize: result.pageSize } });
        }
        catch (err) {
            next(err);
        }
    });
}
function getActiveVacationsHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const page = Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
            const pageSize = Number((_b = req.query.pageSize) !== null && _b !== void 0 ? _b : 10);
            const userId = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId) !== null && _d !== void 0 ? _d : null;
            const result = yield (0, vacations_service_1.getActiveVacations)({ userId, page, pageSize });
            res.json({ data: result.rows, meta: { total: result.total, page: result.page, pageSize: result.pageSize } });
        }
        catch (err) {
            next(err);
        }
    });
}
function getUpcomingVacationsHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const page = Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
            const pageSize = Number((_b = req.query.pageSize) !== null && _b !== void 0 ? _b : 10);
            const userId = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId) !== null && _d !== void 0 ? _d : null;
            const result = yield (0, vacations_service_1.getUpcomingVacations)({ userId, page, pageSize });
            res.json({ data: result.rows, meta: { total: result.total, page: result.page, pageSize: result.pageSize } });
        }
        catch (err) {
            next(err);
        }
    });
}
function getFollowedVacationsHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const page = Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
            const pageSize = Number((_b = req.query.pageSize) !== null && _b !== void 0 ? _b : 10);
            const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
            if (!userId)
                return res.status(401).json({ message: "Unauthorized" });
            const result = yield (0, vacations_service_1.getFollowedVacations)({ userId, page, pageSize });
            res.json({ data: result.rows, meta: { total: result.total, page: result.page, pageSize: result.pageSize } });
        }
        catch (err) {
            next(err);
        }
    });
}
function postFollowHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            if (!userId)
                return res.status(401).json({ message: "Unauthorized" });
            const vacationId = Number(req.params.id);
            if (!vacationId || Number.isNaN(vacationId) || vacationId <= 0) {
                return res.status(400).json({ message: "Invalid vacation id" });
            }
            yield (0, vacations_service_1.followVacation)(userId, vacationId);
            return res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteFollowHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            if (!userId)
                return res.status(401).json({ message: "Unauthorized" });
            const vacationId = Number(req.params.id);
            if (!vacationId || Number.isNaN(vacationId) || vacationId <= 0) {
                return res.status(400).json({ message: "Invalid vacation id" });
            }
            yield (0, vacations_service_1.unfollowVacation)(userId, vacationId);
            return res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
}
function getAllVacationsAdminHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== null && _b !== void 0 ? _b : null;
            const result = yield (0, vacations_service_1.getAllVacations)({ userId, pageSize: -1 });
            res.json({ data: result.rows, meta: { total: result.total, page: result.page, pageSize: result.pageSize } });
        }
        catch (err) {
            next(err);
        }
    });
}

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
exports.postNewVacation = postNewVacation;
exports.putVacationHandler = putVacationHandler;
exports.deleteVacationHandler = deleteVacationHandler;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const zodSchemas_1 = require("../utils/zodSchemas");
const vacations_service_1 = require("../services/vacations.service");
const UPLOAD_DIR = path_1.default.join(process.cwd(), "uploads");
// POST /vacations  (multipart/form-data: fields + optional image file with key "image")
function postNewVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.file;
            const payloadRaw = {
                destination: req.body.destination,
                description: req.body.description,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                price: Number(req.body.price),
            };
            // validate
            const parsed = zodSchemas_1.vacationCreateSchema.safeParse(payloadRaw);
            if (!parsed.success) {
                if (file)
                    yield promises_1.default.unlink(path_1.default.join(UPLOAD_DIR, file.filename)).catch(() => { });
                return res.status(400).json({ message: "Validation error", details: parsed.error.format() });
            }
            // add "image_name" after successful validate
            const finalPayload = Object.assign(Object.assign({}, parsed.data), { image_name: file ? file.filename : null });
            console.log("DEBUG: finalPayload =", finalPayload);
            const id = yield (0, vacations_service_1.createVacation)(finalPayload);
            return res.status(201).json({ id, message: "Vacation created" });
        }
        catch (err) {
            next(err);
        }
    });
}
// PUT /vacations/:id (multipart/form-data, image optional)
function putVacationHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const id = Number(req.params.id);
            if (!id || Number.isNaN(id) || id <= 0)
                return res.status(400).json({ message: "Invalid id" });
            const file = req.file;
            const payload = {
                destination: req.body.destination,
                description: req.body.description,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                price: Number(req.body.price),
                image_name: file ? file.filename : undefined, // undefined means keep existing if not provided
            };
            const parsed = zodSchemas_1.vacationUpdateSchema.safeParse({
                destination: payload.destination,
                description: payload.description,
                start_date: payload.start_date,
                end_date: payload.end_date,
                price: payload.price,
                image_name: (_a = payload.image_name) !== null && _a !== void 0 ? _a : null,
            });
            if (!parsed.success) {
                if (file)
                    yield promises_1.default.unlink(path_1.default.join(UPLOAD_DIR, file.filename)).catch(() => { }); //delete awaiting image
                return res.status(400).json({ message: "Validation error", details: parsed.error.format() });
            }
            if (Date.parse(parsed.data.end_date) < Date.parse(parsed.data.start_date)) {
                if (file)
                    yield promises_1.default.unlink(path_1.default.join(UPLOAD_DIR, file.filename)).catch(() => { }); //delete awaiting image
                return res.status(400).json({ message: "end_date must be >= start_date" });
            }
            // get existing to possibly delete old image
            const existing = yield (0, vacations_service_1.findVacationById)(id);
            if (!existing) {
                if (file)
                    yield promises_1.default.unlink(path_1.default.join(UPLOAD_DIR, file.filename)).catch(() => { }); //delete awaiting image
                return res.status(404).json({ message: "Vacation not found" });
            }
            // if no new image was provided, keep old image_name
            const finalPayload = Object.assign(Object.assign({}, parsed.data), { image_name: file ? file.filename : existing.image_name });
            const ok = yield (0, vacations_service_1.updateVacation)(id, finalPayload);
            if (!ok) {
                // cleanup uploaded file if update failed
                if (file)
                    yield promises_1.default.unlink(path_1.default.join(UPLOAD_DIR, file.filename)).catch(() => { }); //delete awaiting image
                return res.status(500).json({ message: "Update failed" });
            }
            // if new image was provided and there was an old image — delete old file from disk
            if (file && existing.image_name) {
                yield promises_1.default.unlink(path_1.default.join(UPLOAD_DIR, existing.image_name)).catch(() => { }); //delete awaiting image
            }
            return res.status(200).json({ message: "Vacation updated" });
        }
        catch (err) {
            next(err);
        }
    });
}
// DELETE /vacations/:id
function deleteVacationHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = Number(req.params.id);
            if (!id || Number.isNaN(id) || id <= 0)
                return res.status(400).json({ message: "Invalid id" });
            const existing = yield (0, vacations_service_1.findVacationById)(id);
            if (!existing)
                return res.status(404).json({ message: "Vacation not found" });
            const ok = yield (0, vacations_service_1.deleteVacation)(id);
            if (!ok)
                return res.status(500).json({ message: "Delete failed" });
            // delete image file if exists
            if (existing.image_name) {
                yield promises_1.default.unlink(path_1.default.join(UPLOAD_DIR, existing.image_name)).catch(() => { });
            }
            return res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
}

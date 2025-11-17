"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLecturerSchema = exports.ratingRange = void 0;
const zod_1 = require("zod");
exports.ratingRange = zod_1.z.number().int().min(0).max(10);
exports.createLecturerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    skills: zod_1.z.object({
        react: exports.ratingRange,
        node: exports.ratingRange,
        angular: exports.ratingRange,
        dotnet: exports.ratingRange,
        microservices: exports.ratingRange,
        microfrontends: exports.ratingRange,
        ai: exports.ratingRange,
        docker: exports.ratingRange,
    }),
});

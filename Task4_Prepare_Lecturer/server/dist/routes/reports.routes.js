"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_controller_1 = require("../controllers/reports.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/followers", auth_middleware_1.requireAdmin, reports_controller_1.getFollowersJsonHandler);
router.get("/csv", auth_middleware_1.requireAdmin, reports_controller_1.getFollowersCsvHandler);
exports.default = router;

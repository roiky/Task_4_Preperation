"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
//router.get("/test", testAuth);
router.post("/register", auth_controller_1.registerHandler);
router.post("/login", auth_controller_1.loginHandler);
router.put("/setAdmin/:id", auth_controller_1.setAdminHandler); //needs to be admin but then no-one can set the first admin so for testing - no "requireAdmin" middleware
router.get("/me", auth_middleware_1.requireAuth, auth_controller_1.getMeHandler); //return all the deatils based on the provided token
exports.default = router;

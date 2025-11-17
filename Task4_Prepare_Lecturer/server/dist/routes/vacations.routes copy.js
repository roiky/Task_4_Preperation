"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vacations_controller_1 = require("../controllers/vacations.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
//router.get("/test", testAuth);
router.get("/all", vacations_controller_1.getAllVacationsHandler);
router.get("/active", vacations_controller_1.getActiveVacationsHandler);
router.get("/upcoming", vacations_controller_1.getUpcomingVacationsHandler);
router.get("/followed", auth_middleware_1.requireAuth, vacations_controller_1.getFollowedVacationsHandler); // requires auth
router.post("/:id/follow", vacations_controller_1.postFollowHandler); // add requireAuth
router.delete("/:id/follow", vacations_controller_1.deleteFollowHandler); // add requireAuth
exports.default = router;

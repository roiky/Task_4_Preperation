"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vacations_admin_controller_1 = require("../controllers/vacations.admin.controller");
const upload_middleware_1 = require("../middleware/upload.middleware"); // to upload image file!
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.requireAdmin, upload_middleware_1.uploadSingle.single("image"), vacations_admin_controller_1.postNewVacation);
router.put("/:id", auth_middleware_1.requireAdmin, upload_middleware_1.uploadSingle.single("image"), vacations_admin_controller_1.putVacationHandler);
router.delete("/:id", auth_middleware_1.requireAdmin, vacations_admin_controller_1.deleteVacationHandler);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protected_controller_1 = require("../controllers/protected.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, protected_controller_1.protectedRouteHandler);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("./auth.controllers");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/login", auth_controllers_1.AuthController.logInUser);
router.get("/refresh-token", auth_controllers_1.AuthController.refreshToken);
router.get("/change-password", (0, authMiddleware_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT, client_1.UserRole.SUPERADMIN), auth_controllers_1.AuthController.changePassword);
router.get("/forget-password", auth_controllers_1.AuthController.forgetPassword);
router.get("/reset-password", auth_controllers_1.AuthController.resetPassword);
exports.AuthRoutes = router;

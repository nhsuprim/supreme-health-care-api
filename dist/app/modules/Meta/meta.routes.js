"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const meta_controllers_1 = require("./meta.controllers");
const router = express_1.default.Router();
router.get("/", (0, authMiddleware_1.default)(client_1.UserRole.SUPERADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), meta_controllers_1.MetaController.fetchDashboardMetaData);
exports.MetaRoutes = router;

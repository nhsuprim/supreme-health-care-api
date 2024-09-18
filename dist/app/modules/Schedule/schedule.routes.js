"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const schedule_controllers_1 = require("./schedule.controllers");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", (0, authMiddleware_1.default)(client_1.UserRole.DOCTOR), schedule_controllers_1.ScheduleController.getFromDB);
router.get("/:id", (0, authMiddleware_1.default)(client_1.UserRole.SUPERADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR), schedule_controllers_1.ScheduleController.getByIdFromDB);
router.post("/", (0, authMiddleware_1.default)(client_1.UserRole.SUPERADMIN, client_1.UserRole.ADMIN), schedule_controllers_1.ScheduleController.inserIntoDB);
router.delete("/:id", (0, authMiddleware_1.default)(client_1.UserRole.SUPERADMIN, client_1.UserRole.ADMIN), schedule_controllers_1.ScheduleController.deleteFromDB);
exports.scheduleRoutes = router;

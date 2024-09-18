"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const client_1 = require("@prisma/client");
const doctorSchedule_controllers_1 = require("./doctorSchedule.controllers");
const router = express_1.default.Router();
router.post("/", (0, authMiddleware_1.default)(client_1.UserRole.DOCTOR), doctorSchedule_controllers_1.DoctorScheduleController.insertIntoDB);
router.get("/", (0, authMiddleware_1.default)(client_1.UserRole.DOCTOR), doctorSchedule_controllers_1.DoctorScheduleController.getAllFromDB);
router.get("/my-schedule", (0, authMiddleware_1.default)(client_1.UserRole.DOCTOR), doctorSchedule_controllers_1.DoctorScheduleController.getMySchedule);
router.delete("/:id", (0, authMiddleware_1.default)(client_1.UserRole.DOCTOR), doctorSchedule_controllers_1.DoctorScheduleController.deleteFromDB);
exports.DoctorScheduleRoutes = router;

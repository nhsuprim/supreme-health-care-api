"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppiontmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const client_1 = require("@prisma/client");
const appointment_controllers_1 = require("./appointment.controllers");
const router = express_1.default.Router();
router.get("/my-appointment", (0, authMiddleware_1.default)(client_1.UserRole.PATIENT, client_1.UserRole.DOCTOR), appointment_controllers_1.AppointmentController.getMyAppointment);
router.get("/", (0, authMiddleware_1.default)(client_1.UserRole.SUPERADMIN, client_1.UserRole.ADMIN), appointment_controllers_1.AppointmentController.getAllFromDB);
router.post("/", (0, authMiddleware_1.default)(client_1.UserRole.PATIENT), appointment_controllers_1.AppointmentController.createAppointment);
router.patch("/status/:id", (0, authMiddleware_1.default)(client_1.UserRole.SUPERADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR), appointment_controllers_1.AppointmentController.changeAppointmentStatus);
exports.AppiontmentRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const doctor_controllers_1 = require("./doctor.controllers");
const doctor_validation_1 = require("./doctor.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
router.get("/", doctor_controllers_1.DoctorController.getAllDoctor);
router.get("/:id", doctor_controllers_1.DoctorController.getById);
router.patch("/:id", (0, validateRequest_1.default)(doctor_validation_1.DoctorValidation.update), doctor_controllers_1.DoctorController.updateDoctor);
router.delete("/:id", doctor_controllers_1.DoctorController.deleteDoctor);
router.delete("/soft/:id", doctor_controllers_1.DoctorController.softDeleteDoctor);
exports.DoctorRoutes = router;

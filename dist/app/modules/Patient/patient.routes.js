"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const patient_controllers_1 = require("./patient.controllers");
const router = express_1.default.Router();
router.get("/", patient_controllers_1.PattientControllers.getAllPatients);
router.get("/:id", patient_controllers_1.PattientControllers.getById);
router.patch("/:id", patient_controllers_1.PattientControllers.updatePatient);
router.delete("/:id", patient_controllers_1.PattientControllers.deletePatient);
router.delete("/soft/:id", patient_controllers_1.PattientControllers.softDeletePatient);
exports.PatientRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const prescription_controllers_1 = require("./prescription.controllers");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const prescriptions_validation_1 = require("./prescriptions.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
router.get("/", (0, authMiddleware_1.default)(client_1.UserRole.SUPERADMIN, client_1.UserRole.ADMIN), prescription_controllers_1.PrescriptionController.getAllFromDB);
router.get("/my-prescription", (0, authMiddleware_1.default)(client_1.UserRole.PATIENT), prescription_controllers_1.PrescriptionController.patientPrescription);
router.post("/", (0, authMiddleware_1.default)(client_1.UserRole.DOCTOR), (0, validateRequest_1.default)(prescriptions_validation_1.PrescriptionValidation.create), prescription_controllers_1.PrescriptionController.insertIntoDB);
exports.PrescriptionRoutes = router;

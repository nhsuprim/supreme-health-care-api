"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controllers_1 = require("./user.controllers");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const fileUploaders_1 = require("../../helpers/fileUploaders");
const user_validation_1 = require("./user.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", (0, authMiddleware_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN), user_controllers_1.userControllers.getAllFromDb);
router.get("/me", (0, authMiddleware_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT, client_1.UserRole.SUPERADMIN), user_controllers_1.userControllers.getMyProfile);
router.patch("/status/:id", (0, authMiddleware_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN), user_controllers_1.userControllers.updateUserStatus);
router.post("/create-admin", (0, authMiddleware_1.default)("ADMIN", "SUPERADMIN"), fileUploaders_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return user_controllers_1.userControllers.createAdmin(req, res, next);
});
router.post("/create-doctor", (0, authMiddleware_1.default)("ADMIN", "SUPERADMIN"), fileUploaders_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return user_controllers_1.userControllers.createDoctor(req, res, next);
});
router.post("/create-patient", fileUploaders_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.userValidation.createPatient.parse(JSON.parse(req.body.data));
    return user_controllers_1.userControllers.createPatient(req, res, next);
});
router.patch("/update-my-profile", (0, authMiddleware_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT, client_1.UserRole.SUPERADMIN), fileUploaders_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controllers_1.userControllers.updateProfile(req, res, next);
});
exports.userRoutes = router;

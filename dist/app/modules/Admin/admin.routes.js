"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controllers_1 = require("./admin.controllers");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const adminValidation_1 = require("./adminValidation");
const router = express_1.default.Router();
router.get("/", admin_controllers_1.AdminController.getAllFromDb);
router.get("/:id", admin_controllers_1.AdminController.getById);
router.patch("/:id", (0, validateRequest_1.default)(adminValidation_1.AdminValidation.update), admin_controllers_1.AdminController.update);
router.delete("/:id", admin_controllers_1.AdminController.deleteAdmin);
router.delete("/soft/:id", admin_controllers_1.AdminController.softDeleteAdmin);
exports.AdminRoutes = router;

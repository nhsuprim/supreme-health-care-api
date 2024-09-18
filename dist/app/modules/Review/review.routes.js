"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controllers_1 = require("./review.controllers");
const client_1 = require("@prisma/client");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
router.get("/", review_controllers_1.ReviewController.getAllFromDB);
router.post("/", (0, authMiddleware_1.default)(client_1.UserRole.PATIENT), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.create), review_controllers_1.ReviewController.insertIntoDB);
exports.ReviewRoutes = router;

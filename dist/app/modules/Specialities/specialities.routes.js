"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const specialities_controllers_1 = require("./specialities.controllers");
const fileUploaders_1 = require("../../helpers/fileUploaders");
const specialities_validation_1 = require("./specialities.validation");
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/", specialities_controllers_1.SpecialitiesController.getAllFromDb);
router.post("/", fileUploaders_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = specialities_validation_1.SpecilitiesValidation.create.parse(JSON.parse(req.body.data));
    return specialities_controllers_1.SpecialitiesController.insertToDb(req, res, next);
});
router.patch("/:id", (0, authMiddleware_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN), // Ensure only authorized roles can update
fileUploaders_1.fileUploader.upload.single("file"), // Handle file upload if a new file is provided
(req, res, next) => {
    // Parse and validate the request body using your validation logic
    req.body = specialities_validation_1.SpecilitiesValidation.update.parse(JSON.parse(req.body.data));
    return specialities_controllers_1.SpecialitiesController.updateInDb(req, res, next);
});
router.delete("/:id", (0, authMiddleware_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN), specialities_controllers_1.SpecialitiesController.deletefromDB);
exports.SpecialitiesRoutes = router;

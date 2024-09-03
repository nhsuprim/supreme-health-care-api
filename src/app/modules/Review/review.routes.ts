import express from "express";
import { ReviewController } from "./review.controllers";
import { UserRole } from "@prisma/client";
import auth from "../../middleware/authMiddleware";
import validateRequest from "../../middleware/validateRequest";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

router.get("/", ReviewController.getAllFromDB);

router.post(
    "/",
    auth(UserRole.PATIENT),
    validateRequest(ReviewValidation.create),
    ReviewController.insertIntoDB
);

export const ReviewRoutes = router;

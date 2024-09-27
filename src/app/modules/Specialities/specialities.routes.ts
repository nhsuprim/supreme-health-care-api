import express, { NextFunction, Request, Response } from "express";
import { SpecialitiesController } from "./specialities.controllers";
import { fileUploader } from "../../helpers/fileUploaders";
import { SpecilitiesValidation } from "./specialities.validation";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", SpecialitiesController.getAllFromDb);

router.post(
    "/",
    auth(UserRole.ADMIN, UserRole.SUPERADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecilitiesValidation.create.parse(
            JSON.parse(req.body.data)
        );

        return SpecialitiesController.insertToDb(req, res, next);
    }
);

router.patch(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPERADMIN), // Ensure only authorized roles can update
    fileUploader.upload.single("file"), // Handle file upload if a new file is provided
    (req: Request, res: Response, next: NextFunction) => {
        // Parse and validate the request body using your validation logic
        req.body = SpecilitiesValidation.update.parse(
            JSON.parse(req.body.data)
        );

        return SpecialitiesController.updateInDb(req, res, next);
    }
);

router.delete(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPERADMIN),
    SpecialitiesController.deletefromDB
);

export const SpecialitiesRoutes = router;

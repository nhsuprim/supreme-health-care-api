import express, { NextFunction, Request, Response } from "express";
import { DoctorController } from "./doctor.controllers";
import { DoctorValidation } from "./doctor.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.get("/", DoctorController.getAllDoctor);

router.get("/:id", DoctorController.getById);

router.patch(
    "/:id",
    validateRequest(DoctorValidation.update),
    DoctorController.updateDoctor
);

router.delete("/:id", DoctorController.deleteDoctor);

router.delete("/soft/:id", DoctorController.softDeleteDoctor);

export const DoctorRoutes = router;

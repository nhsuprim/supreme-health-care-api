import { UserRole } from "@prisma/client";
import express from "express";
import { PrescriptionController } from "./prescription.controllers";
import auth from "../../middleware/authMiddleware";
import { PrescriptionValidation } from "./prescriptions.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.get(
    "/",
    auth(UserRole.SUPERADMIN, UserRole.ADMIN),
    PrescriptionController.getAllFromDB
);

router.get(
    "/my-prescription",
    auth(UserRole.PATIENT),
    PrescriptionController.patientPrescription
);

router.post(
    "/",
    auth(UserRole.DOCTOR),
    validateRequest(PrescriptionValidation.create),
    PrescriptionController.insertIntoDB
);

export const PrescriptionRoutes = router;

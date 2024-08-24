import express from "express";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "@prisma/client";
import { AppointmentController } from "./appointment.controllers";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.PATIENT),
    AppointmentController.createAppointment
);

router.get(
    "/my-appointment",
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment
);

export const AppiontmentRoutes = router;

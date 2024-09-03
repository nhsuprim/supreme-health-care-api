import express from "express";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "@prisma/client";
import { AppointmentController } from "./appointment.controllers";

const router = express.Router();

router.get(
    "/my-appointment",
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment
);

router.get(
    "/",
    auth(UserRole.SUPERADMIN, UserRole.ADMIN),
    AppointmentController.getAllFromDB
);

router.post(
    "/",
    auth(UserRole.PATIENT),
    AppointmentController.createAppointment
);

router.patch(
    "/status/:id",
    auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    AppointmentController.changeAppointmentStatus
);

export const AppiontmentRoutes = router;

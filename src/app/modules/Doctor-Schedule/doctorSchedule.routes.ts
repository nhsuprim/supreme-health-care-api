import express from "express";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controllers";

const router = express.Router();

router.post("/", auth(UserRole.DOCTOR), DoctorScheduleController.insertIntoDB);

router.get("/", auth(UserRole.DOCTOR), DoctorScheduleController.getAllFromDB);

router.get(
    "/my-schedule",
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
);

router.delete(
    "/:id",
    auth(UserRole.DOCTOR),
    DoctorScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;

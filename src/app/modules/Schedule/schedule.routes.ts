import express from "express";
import { ScheduleController } from "./schedule.controllers";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.DOCTOR), ScheduleController.getFromDB);

router.get(
    "/:id",
    auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    ScheduleController.getByIdFromDB
);

router.post(
    "/",
    auth(UserRole.SUPERADMIN, UserRole.ADMIN),
    ScheduleController.inserIntoDB
);

router.delete(
    "/:id",
    auth(UserRole.SUPERADMIN, UserRole.ADMIN),
    ScheduleController.deleteFromDB
);

export const scheduleRoutes = router;

import express from "express";

import { UserRole } from "@prisma/client";
import auth from "../../middleware/authMiddleware";
import { MetaController } from "./meta.controllers";

const router = express.Router();

router.get(
    "/",
    auth(
        UserRole.SUPERADMIN,
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ),
    MetaController.fetchDashboardMetaData
);

export const MetaRoutes = router;

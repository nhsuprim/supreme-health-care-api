import express, { NextFunction, Request, Response } from "express";
import { DoctorController } from "./doctor.controllers";

const router = express.Router();

router.get("/", DoctorController.getAllDoctor);

router.get("/:id", DoctorController.getById);

router.patch("/:id", DoctorController.updateDoctor);

router.delete("/:id", DoctorController.deleteDoctor);

router.delete("/soft/:id", DoctorController.softDeleteDoctor);

export const DoctorRoutes = router;

import express from "express";
import { PattientControllers } from "./patient.controllers";

const router = express.Router();

router.get("/", PattientControllers.getAllPatients);

router.get("/:id", PattientControllers.getById);

router.patch("/:id", PattientControllers.updatePatient);

router.delete("/:id", PattientControllers.deletePatient);

router.delete("/soft/:id", PattientControllers.softDeletePatient);

export const PatientRoutes = router;

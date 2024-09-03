import express from "express";
import { PaymentController } from "./payment.controllers";

const router = express.Router();

router.get("/ipn", PaymentController.validatePayment);

router.post("/init-payment/:appointmentId", PaymentController.initPayment);

export const PaymentRoutes = router;

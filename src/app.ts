import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./app/routes";
import httpStatus from "http-status";
import cron from "node-cron";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middleware/globalErrorHandle";
import { AppointmentService } from "./app/modules/Appointment/appointment.services";

const app: Application = express();
app.use(cors());
app.use(cookieParser());
dotenv.config();

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send({
        Message: "Supreme health care server..",
    });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

cron.schedule("* * * * *", () => {
    try {
        AppointmentService.cancelUnpaidAppointments();
    } catch (err) {
        console.error(err);
    }
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});

export default app;

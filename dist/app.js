"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const http_status_1 = __importDefault(require("http-status"));
const node_cron_1 = __importDefault(require("node-cron"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandle_1 = __importDefault(require("./app/middleware/globalErrorHandle"));
const appointment_services_1 = require("./app/modules/Appointment/appointment.services");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send({
        Message: "Supreme health care server..",
    });
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandle_1.default);
node_cron_1.default.schedule("* * * * *", () => {
    try {
        appointment_services_1.AppointmentService.cancelUnpaidAppointments();
    }
    catch (err) {
        console.error(err);
    }
});
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
// import express, { Application, NextFunction, Request, Response } from 'express';
// import cors from 'cors';
// import router from './app/routes';
// import httpStatus from 'http-status';
// import cookieParser from 'cookie-parser';
// import dotenv from "dotenv"
// import globalErrorHandler from './app/middleware/globalErrorHandle';
// const app:Application = express();
// // middleware
// app.use(cors())
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(globalErrorHandler)
// app.use(cookieParser());
// dotenv.config()
// //routes
// // app.use('/api/v1/user', userRoutes)
// // app.use('/api/v1/admin', AdminRoutes)
// app.use('/api/v1/', router)
// // error handling middleware
// // app.use((err:any ,req:Request, res:Response,  next:NextFunction) =>{
// //     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
// //         status: false,
// //         message: err.message,
// //         err: err
// //     })
// // })
// app.get("/", (req: Request, res: Response) => {
//     res.status(200).json({
//         success: true,
//         message: "Welcome to Supreme Health Care",
//     })
// })
// app.use((req:Request, res:Response,  next:NextFunction) =>{
//     res.status(httpStatus.NOT_FOUND).json({
//         status: false,
//         message: "API Not Found",
//         error:{
//             path: req.originalUrl,
//             message: "API Error",
//         }
//     })
// })
// export default app;

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

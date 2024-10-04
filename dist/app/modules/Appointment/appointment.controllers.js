"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const appointment_services_1 = require("./appointment.services");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../shared/pick"));
const appointment_constant_1 = require("./appointment.constant");
const createAppointment = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        const user = req.user;
        console.log(user);
        const result = await appointment_services_1.AppointmentService.createAppointment(user, req.body);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Appointment created successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyAppointment = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        const user = req.user;
        const filters = (0, pick_1.default)(req.query, ["status", "paymentStatus"]);
        const options = (0, pick_1.default)(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);
        const result = await appointment_services_1.AppointmentService.getMyAppointment(user, filters, options);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "My Appointment retrive successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, appointment_constant_1.appointmentFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await appointment_services_1.AppointmentService.getAllFromDB(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "All Appointments retrieved successfully",
        data: result,
    });
});
const changeAppointmentStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;
    const result = await appointment_services_1.AppointmentService.changeAppointmentStatus(id, status, user);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Appointment status changed successfully",
        data: result,
    });
});
exports.AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllFromDB,
    changeAppointmentStatus,
};

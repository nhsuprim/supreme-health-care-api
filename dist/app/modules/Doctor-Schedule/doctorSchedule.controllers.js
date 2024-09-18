"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const doctorSchedule_services_1 = require("./doctorSchedule.services");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../shared/pick"));
const doctorSchedule_constant_1 = require("./doctorSchedule.constant");
const insertIntoDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new Error("User not authenticated");
    }
    try {
        const result = yield doctorSchedule_services_1.DoctorScheduleService.insertIntoDB(user, req.body);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Schedule successfully inserted",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}));
const getMySchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ["startDate", "endDate", "isBooked"]);
    const options = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const user = req.user;
    const result = yield doctorSchedule_services_1.DoctorScheduleService.getMySchedule(filters, options, user);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "My Schedule successfully inserted",
        data: result,
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, doctorSchedule_constant_1.scheduleFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield doctorSchedule_services_1.DoctorScheduleService.getAllFromDB(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "All Schedule successfully inserted",
        meta: result.meta,
        data: result.data,
    });
}));
const deleteFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { id } = req.params;
    const result = yield doctorSchedule_services_1.DoctorScheduleService.deleteFromDB(user, id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Schedule successfully deleted",
        data: result,
    });
}));
exports.DoctorScheduleController = {
    insertIntoDB,
    getMySchedule,
    getAllFromDB,
    deleteFromDB,
};

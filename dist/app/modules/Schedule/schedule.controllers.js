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
exports.ScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const schedule_services_1 = require("./schedule.services");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../shared/pick"));
const inserIntoDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield schedule_services_1.ScheduleService.inserIntoDB(req.body);
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
const getFromDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, ["startDate", "endDate"]);
        const options = (0, pick_1.default)(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);
        const user = req.user;
        const result = yield schedule_services_1.ScheduleService.getFromDB(filters, options, user);
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
const getByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield schedule_services_1.ScheduleService.getByIdFromDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Schedule successfully fetched by id",
        data: result,
    });
}));
const deleteFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield schedule_services_1.ScheduleService.deleteFromDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Schedule successfully deleted",
        data: result,
    });
}));
exports.ScheduleController = {
    inserIntoDB,
    getFromDB,
    getByIdFromDB,
    deleteFromDB,
};

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
exports.DoctorController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../shared/pick"));
const doctor_constant_1 = require("./doctor.constant");
const doctor_services_1 = require("./doctor.services");
const http_status_1 = __importDefault(require("http-status"));
const getAllDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, doctor_constant_1.doctorFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(filters);
    const result = yield doctor_services_1.DoctorServices.getAllDoctor(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: " All doctor are successfully retrieved",
        meta: result.meta,
        data: result.data,
    });
}));
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield doctor_services_1.DoctorServices.getById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Doctor successfully retrieved by id",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //  console.log(req.params);
        const result = yield doctor_services_1.DoctorServices.deleteDoctor(req.params.id);
        res.status(200).json({
            success: true,
            message: "Admin successfully deleted",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const softDeleteDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //  console.log(req.params);
        const result = yield doctor_services_1.DoctorServices.softDeleteDoctor(req.params.id);
        res.status(200).json({
            success: true,
            message: "Doctor successfully deleted",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedDoctor = yield doctor_services_1.DoctorServices.updateDoctor(id, req.body);
        res.status(200).json({
            success: true,
            message: "Doctor successfully updated",
            data: updatedDoctor,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.DoctorController = {
    getAllDoctor,
    getById,
    softDeleteDoctor,
    deleteDoctor,
    updateDoctor,
};

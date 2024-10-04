"use strict";
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
const getAllDoctor = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, doctor_constant_1.doctorFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(filters);
    const result = await doctor_services_1.DoctorServices.getAllDoctor(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: " All doctor are successfully retrieved",
        meta: result.meta,
        data: result.data,
    });
});
const getById = async (req, res, next) => {
    try {
        const result = await doctor_services_1.DoctorServices.getById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Doctor successfully retrieved by id",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteDoctor = async (req, res, next) => {
    try {
        //  console.log(req.params);
        const result = await doctor_services_1.DoctorServices.deleteDoctor(req.params.id);
        res.status(200).json({
            success: true,
            message: "Admin successfully deleted",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const softDeleteDoctor = async (req, res, next) => {
    try {
        //  console.log(req.params);
        const result = await doctor_services_1.DoctorServices.softDeleteDoctor(req.params.id);
        res.status(200).json({
            success: true,
            message: "Doctor successfully deleted",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const updateDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedDoctor = await doctor_services_1.DoctorServices.updateDoctor(id, req.body);
        res.status(200).json({
            success: true,
            message: "Doctor successfully updated",
            data: updatedDoctor,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.DoctorController = {
    getAllDoctor,
    getById,
    softDeleteDoctor,
    deleteDoctor,
    updateDoctor,
};

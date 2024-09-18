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
exports.PattientControllers = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const patient_services_1 = require("./patient.services");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../shared/pick"));
const patient_constant_1 = require("./patient.constant");
const getAllPatients = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, patient_constant_1.patientFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    // console.log(filters);
    const result = yield patient_services_1.PatientServices.getAllfromDB(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: " All patient are successfully retrieved",
        meta: result.meta,
        data: result.data,
    });
}));
const getById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield patient_services_1.PatientServices.getById(id);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Patient successfully retrieved by id",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}));
const deletePatient = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield patient_services_1.PatientServices.deletePatient(id);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Patient successfully deleted",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}));
const softDeletePatient = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield patient_services_1.PatientServices.softDeletePatient(id);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Patient successfully soft deleted",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}));
const updatePatient = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield patient_services_1.PatientServices.updatePatient(id, req.body);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Patient successfully updated",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.PattientControllers = {
    getAllPatients,
    getById,
    deletePatient,
    softDeletePatient,
    updatePatient,
};

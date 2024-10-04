"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const prescription_services_1 = require("./prescription.services");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../shared/pick"));
const prescription_constent_1 = require("./prescription.constent");
const insertIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await prescription_services_1.PrescriptionService.insertIntoDB(user, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Prescription inserted successfully",
        data: result,
    });
});
const patientPrescription = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const options = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = await prescription_services_1.PrescriptionService.patientPrescription(user, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Patient Prescription is successfully fetched",
        meta: result.meta,
        data: result.data,
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, prescription_constent_1.prescriptionFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await prescription_services_1.PrescriptionService.getAllFromDB(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "All Prescription feteched successfully",
        meta: result.meta,
        data: result.data,
    });
});
exports.PrescriptionController = {
    insertIntoDB,
    patientPrescription,
    getAllFromDB,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_services_1 = require("./admin.services");
const pick_1 = __importDefault(require("../../shared/pick"));
const admin_constant_1 = require("./admin.constant");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const getAllFromDb = (0, catchAsync_1.default)(async (req, res, next) => {
    const filters = (0, pick_1.default)(req.query, admin_constant_1.adminFilterableFields);
    const options = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const results = await admin_services_1.AdminService.getAllAdmins(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: " All admins are successfully retrieved",
        meta: results.meta,
        data: results.data,
    });
});
const getById = async (req, res, next) => {
    try {
        const result = await admin_services_1.AdminService.getById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Admin successfully retrieved by id",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const update = async (req, res, next) => {
    try {
        //  console.log(req.params);
        const result = await admin_services_1.AdminService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Admin successfully updated",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteAdmin = async (req, res, next) => {
    try {
        //  console.log(req.params);
        const result = await admin_services_1.AdminService.deleteAdmin(req.params.id);
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
const softDeleteAdmin = async (req, res, next) => {
    try {
        //  console.log(req.params);
        const result = await admin_services_1.AdminService.softDeleteAdmin(req.params.id);
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
exports.AdminController = {
    getAllFromDb,
    getById,
    update,
    deleteAdmin,
    softDeleteAdmin,
};

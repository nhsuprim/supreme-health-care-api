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
exports.AdminController = void 0;
const admin_services_1 = require("./admin.services");
const pick_1 = __importDefault(require("../../shared/pick"));
const admin_constant_1 = require("./admin.constant");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const getAllFromDb = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, admin_constant_1.adminFilterableFields);
    const options = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const results = yield admin_services_1.AdminService.getAllAdmins(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: " All admins are successfully retrieved",
        meta: results.meta,
        data: results.data,
    });
}));
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield admin_services_1.AdminService.getById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Admin successfully retrieved by id",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //  console.log(req.params);
        const result = yield admin_services_1.AdminService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Admin successfully updated",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //  console.log(req.params);
        const result = yield admin_services_1.AdminService.deleteAdmin(req.params.id);
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
const softDeleteAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //  console.log(req.params);
        const result = yield admin_services_1.AdminService.softDeleteAdmin(req.params.id);
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
exports.AdminController = {
    getAllFromDb,
    getById,
    update,
    deleteAdmin,
    softDeleteAdmin,
};

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
exports.userControllers = void 0;
const user_services_1 = require("./user.services");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../shared/pick"));
const user_constant_1 = require("./user.constant");
const http_status_1 = __importDefault(require("http-status"));
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_services_1.userServices.createAdmin(req);
        res.status(200).json({
            success: true,
            message: "Admin created successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const createDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_services_1.userServices.createDoctor(req);
        res.status(200).json({
            success: true,
            message: "Doctor created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create Doctor",
            error: error,
        });
    }
});
const createPatient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_services_1.userServices.createPatient(req);
        res.status(200).json({
            success: true,
            message: "Patient created successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllFromDb = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_constant_1.UserFilterableField);
    const options = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const results = yield user_services_1.userServices.getAllUser(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: " All users are successfully retrieved",
        meta: results.meta,
        data: results.data,
    });
}));
const updateUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //  console.log(req.params);
        const result = yield user_services_1.userServices.updateUserStatus(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "User Status successfully updated",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const results = yield user_services_1.userServices.getMyProfile(user);
        res.status(200).json({
            success: true,
            message: "My profile retrieved successfully",
            data: results,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const result = yield user_services_1.userServices.updateProfile(user, req);
        res.status(200).json({
            success: true,
            message: "Update My profile successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userControllers = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDb,
    updateUserStatus,
    getMyProfile,
    updateProfile,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const specialities_services_1 = require("./specialities.services");
const pick_1 = __importDefault(require("../../shared/pick"));
const specialities_constant_1 = require("./specialities.constant");
const insertToDb = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        const result = await specialities_services_1.SpecialitiesService.insertToDb(req);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Specialities created successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllFromDb = (0, catchAsync_1.default)(async (req, res, next) => {
    const filters = (0, pick_1.default)(req.query, specialities_constant_1.SpecialitiesFilterableFields);
    const options = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const results = await specialities_services_1.SpecialitiesService.getAllfromDB(filters, options);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: " All specialities are successfully retrieved",
        meta: results.meta,
        data: results.data,
    });
});
const updateInDb = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const file = req.file ? req.file : undefined;
        const result = await specialities_services_1.SpecialitiesService.updateInDb(id, data, file);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Speciality updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deletefromDB = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        const result = await specialities_services_1.SpecialitiesService.deletefromDB(req.params.id);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "speciality are successfully deleted",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.SpecialitiesController = {
    insertToDb,
    getAllFromDb,
    deletefromDB,
    updateInDb,
};

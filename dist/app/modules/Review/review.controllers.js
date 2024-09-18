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
exports.ReviewController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const review_services_1 = require("./review.services");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../shared/pick"));
const review_constant_1 = require("./review.constant");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield review_services_1.ReviewService.insertIntoDB(user, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Prescription inserted successfully",
        data: result,
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, review_constant_1.reviewFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield review_services_1.ReviewService.getAllFromDB(filters, options);
    // sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     success: true,
    //     message: "Reviews retrieval successfully",
    //     meta: result.meta,
    //     data: result.data,
    // });
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Prescription inserted successfully",
        meta: result.meta,
        data: result.data,
    });
}));
exports.ReviewController = {
    insertIntoDB,
    getAllFromDB,
};

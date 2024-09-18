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
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const payment_services_1 = require("./payment.services");
const http_status_1 = __importDefault(require("http-status"));
const initPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointmentId } = req.params;
        // console.log(req.params);
        const result = yield payment_services_1.PaymentService.initPayment(appointmentId);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Payment initialized successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}));
const validatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_services_1.PaymentService.validatePayment(req.query);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Payment validate successfully",
        data: result,
    });
}));
exports.PaymentController = {
    initPayment,
    validatePayment,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const payment_services_1 = require("./payment.services");
const http_status_1 = __importDefault(require("http-status"));
const initPayment = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        // console.log(req.params);
        const result = await payment_services_1.PaymentService.initPayment(appointmentId);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Payment initialized successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const validatePayment = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_services_1.PaymentService.validatePayment(req.query);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Payment validate successfully",
        data: result,
    });
});
exports.PaymentController = {
    initPayment,
    validatePayment,
};

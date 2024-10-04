"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ssl_services_1 = require("../SSL/ssl.services");
const initPayment = async (appointmentId) => {
    const paymentData = await prisma_1.default.payment.findFirstOrThrow({
        where: {
            appointmentId: appointmentId,
        },
        include: {
            appointment: {
                include: {
                    patient: true,
                },
            },
        },
    });
    const initPaymentData = {
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        name: paymentData.appointment.patient.name,
        email: paymentData.appointment.patient.email,
        address: paymentData.appointment.patient.address,
        phoneNumber: paymentData.appointment.patient.contactNumber,
    };
    const result = await ssl_services_1.SSLService.initPayment(initPaymentData);
    return {
        paymentUrl: result.GatewayPageURL,
    };
};
const validatePayment = async (payload) => {
    // if (!payload || !payload.status || !(payload.status === 'VALID')) {
    //     return {
    //         message: "Invalid Payment!"
    //     }
    // }
    // const response = await SSLService.validatePayment(payload);
    // if (response?.status !== 'VALID') {
    //     return {
    //         message: "Payment Failed!"
    //     }
    // }
    const response = payload;
    await prisma_1.default.$transaction(async (tx) => {
        const updatedPaymentData = await tx.payment.update({
            where: {
                transactionId: response.tran_id,
            },
            data: {
                status: client_1.PaymentStatus.PAID,
                paymentGatewayData: response,
            },
        });
        await tx.appointment.update({
            where: {
                id: updatedPaymentData.appointmentId,
            },
            data: {
                paymentStatus: client_1.PaymentStatus.PAID,
            },
        });
    });
    return {
        message: "Payment success!",
    };
};
exports.PaymentService = {
    initPayment,
    validatePayment,
};

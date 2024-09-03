import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PaymentService } from "./payment.services";
import httpStatus from "http-status";

const initPayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { appointmentId } = req.params;
            // console.log(req.params);
            const result = await PaymentService.initPayment(appointmentId);
            res.status(httpStatus.OK).json({
                success: true,
                message: "Payment initialized successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

const validatePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.validatePayment(req.query);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Payment validate successfully",
        data: result,
    });
});

export const PaymentController = {
    initPayment,
    validatePayment,
};

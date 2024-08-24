import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IAuthUser } from "../../interface/user";
import { AppointmentService } from "./appointment.services";
import httpStatus from "http-status";
import pick from "../../shared/pick";

const createAppointment = catchAsync(
    async (
        req: Request & { user?: IAuthUser },
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = req.user;
            console.log(user);
            const result = await AppointmentService.createAppointment(
                user as IAuthUser,
                req.body
            );

            res.status(httpStatus.OK).json({
                success: true,
                message: "Appointment created successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

export const appointmentFilterableFields: string[] = [
    "status",
    "paymentStatus",
    "patientEmail",
    "doctorEmail",
];

const getMyAppointment = catchAsync(
    async (
        req: Request & { user?: IAuthUser },
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = req.user;
            const filters = pick(req.query, ["status", "paymentStatus"]);
            const options = pick(req.query, [
                "limit",
                "page",
                "sortBy",
                "sortOrder",
            ]);

            const result = await AppointmentService.getMyAppointment(
                user as IAuthUser,
                filters,
                options
            );

            res.status(httpStatus.OK).json({
                success: true,
                message: "My Appointment retrive successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

export const AppointmentController = {
    createAppointment,
    getMyAppointment,
};

import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IAuthUser } from "../../interface/user";
import { AppointmentService } from "./appointment.services";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { appointmentFilterableFields } from "./appointment.constant";

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

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, appointmentFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await AppointmentService.getAllFromDB(filters, options);
    res.status(httpStatus.OK).json({
        success: true,
        message: "All Appointments retrieved successfully",
        data: result,
    });
});

const changeAppointmentStatus = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;
        const user = req.user;

        const result = await AppointmentService.changeAppointmentStatus(
            id,
            status,
            user as IAuthUser
        );
        res.status(httpStatus.OK).json({
            success: true,
            message: "Appointment status changed successfully",
            data: result,
        });
    }
);

export const AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllFromDB,
    changeAppointmentStatus,
};

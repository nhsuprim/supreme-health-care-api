import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IAuthUser } from "../../interface/user";
import { DoctorScheduleService } from "./doctorSchedule.services";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { scheduleFilterableFields } from "./doctorSchedule.constant";

const insertIntoDB = catchAsync(
    async (
        req: Request & { user?: IAuthUser },
        res: Response,
        next: NextFunction
    ) => {
        const user = req.user;
        if (!user) {
            throw new Error("User not authenticated");
        }
        try {
            const result = await DoctorScheduleService.insertIntoDB(
                user,
                req.body
            );

            res.status(httpStatus.OK).json({
                success: true,
                message: "Schedule successfully inserted",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

const getMySchedule = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
        const options = pick(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);

        const user = req.user;
        const result = await DoctorScheduleService.getMySchedule(
            filters,
            options,
            user as IAuthUser
        );

        res.status(httpStatus.OK).json({
            success: true,
            message: "My Schedule successfully inserted",
            data: result,
        });
    }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await DoctorScheduleService.getAllFromDB(filters, options);

    res.status(httpStatus.OK).json({
        success: true,
        message: "All Schedule successfully inserted",
        meta: result.meta,
        data: result.data,
    });
});

const deleteFromDB = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const user = req.user;
        const { id } = req.params;
        const result = await DoctorScheduleService.deleteFromDB(
            user as IAuthUser,
            id
        );

        res.status(httpStatus.OK).json({
            success: true,
            message: "Schedule successfully deleted",
            data: result,
        });
    }
);

export const DoctorScheduleController = {
    insertIntoDB,
    getMySchedule,
    getAllFromDB,
    deleteFromDB,
};

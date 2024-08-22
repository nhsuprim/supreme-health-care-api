import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.services";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { IAuthUser } from "../../interface/user";

const inserIntoDB = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await ScheduleService.inserIntoDB(req.body);

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
const getFromDB = catchAsync(
    async (
        req: Request & { user?: IAuthUser },
        res: Response,
        next: NextFunction
    ) => {
        try {
            const filters = pick(req.query, ["startDate", "endDate"]);
            const options = pick(req.query, [
                "limit",
                "page",
                "sortBy",
                "sortOrder",
            ]);

            const user = req.user;
            const result = await ScheduleService.getFromDB(
                filters,
                options,
                user as IAuthUser
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

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ScheduleService.getByIdFromDB(id);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Schedule successfully fetched by id",
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ScheduleService.deleteFromDB(id);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Schedule successfully deleted",
        data: result,
    });
});

export const ScheduleController = {
    inserIntoDB,
    getFromDB,
    getByIdFromDB,
    deleteFromDB,
};

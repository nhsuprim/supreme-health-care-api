import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import httpStatus from "http-status";
import { SpecialitiesService } from "./specialities.services";
import pick from "../../shared/pick";
import { SpecialitiesFilterableFields } from "./specialities.constant";

const insertToDb = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await SpecialitiesService.insertToDb(req);

            res.status(httpStatus.OK).json({
                success: true,
                message: "Specialities created successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

const getAllFromDb = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const filters = pick(req.query, SpecialitiesFilterableFields);
        const options = pick(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);
        const results = await SpecialitiesService.getAllfromDB(
            filters,
            options
        );
        res.status(httpStatus.OK).json({
            success: true,
            message: " All specialities are successfully retrieved",
            meta: results.meta,
            data: results.data,
        });
    }
);

const deletefromDB = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await SpecialitiesService.deletefromDB(
                req.params.id
            );
            res.status(httpStatus.OK).json({
                success: true,
                message: "speciality are successfully deleted",

                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
);

export const SpecialitiesController = {
    insertToDb,
    getAllFromDb,
    deletefromDB,
};

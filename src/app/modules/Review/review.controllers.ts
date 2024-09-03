import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IAuthUser } from "../../interface/user";
import { ReviewService } from "./review.services";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { reviewFilterableFields } from "./review.constant";

const insertIntoDB = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const user = req.user;
        const result = await ReviewService.insertIntoDB(
            user as IAuthUser,
            req.body
        );
        res.status(httpStatus.OK).json({
            success: true,
            message: "Prescription inserted successfully",
            data: result,
        });
    }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, reviewFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await ReviewService.getAllFromDB(filters, options);
    // sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     success: true,
    //     message: "Reviews retrieval successfully",
    //     meta: result.meta,
    //     data: result.data,
    // });
    res.status(httpStatus.OK).json({
        success: true,
        message: "Prescription inserted successfully",
        meta: result.meta,
        data: result.data,
    });
});

export const ReviewController = {
    insertIntoDB,
    getAllFromDB,
};

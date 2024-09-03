import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IAuthUser } from "../../interface/user";
import { MetaService } from "./meta.services";
import httpStatus from "http-status";

const fetchDashboardMetaData = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
        const user = req.user;
        const result = await MetaService.fetchDashboardMetaData(
            user as IAuthUser
        );

        res.status(httpStatus.OK).json({
            success: true,
            message: "Dashboard meta data successfully fetched",
            data: result,
        });
    }
);

export const MetaController = {
    fetchDashboardMetaData,
};

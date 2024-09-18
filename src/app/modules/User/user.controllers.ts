import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.services";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { UserFilterableField } from "./user.constant";
import httpStatus from "http-status";
import { User } from "@prisma/client";
import { IAuthUser } from "../../interface/user";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userServices.createAdmin(req);
        res.status(200).json({
            success: true,
            message: "Admin created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const createDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await userServices.createDoctor(req);
        res.status(200).json({
            success: true,
            message: "Doctor created successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create Doctor",
            error: error,
        });
    }
};

const createPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await userServices.createPatient(req);
        res.status(200).json({
            success: true,
            message: "Patient created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getAllFromDb = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const filters = pick(req.query, UserFilterableField);
        const options = pick(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);
        const results = await userServices.getAllUser(filters, options);
        res.status(httpStatus.OK).json({
            success: true,
            message: " All users are successfully retrieved",
            meta: results.meta,
            data: results.data,
        });
    }
);

const updateUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //  console.log(req.params);
        const result = await userServices.updateUserStatus(
            req.params.id,
            req.body
        );
        res.status(200).json({
            success: true,
            message: "User Status successfully updated",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getMyProfile = async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
) => {
    const user = req.user;
    try {
        const results = await userServices.getMyProfile(user as IAuthUser);
        res.status(200).json({
            success: true,
            message: "My profile retrieved successfully",
            data: results,
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;

        const result = await userServices.updateProfile(user as IAuthUser, req);
        res.status(200).json({
            success: true,
            message: "Update My profile successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const userControllers = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDb,
    updateUserStatus,
    getMyProfile,
    updateProfile,
};

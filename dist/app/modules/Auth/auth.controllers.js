"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_services_1 = require("./auth.services");
const http_status_1 = __importDefault(require("http-status"));
const logInUser = async (req, res, next) => {
    try {
        const result = await auth_services_1.AuthService.logInUser(req.body);
        const { refreshToken } = result;
        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
        });
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken: result.accessToken,
                needPasswordChange: result.needPasswordChange,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const result = await auth_services_1.AuthService.refreshToken(refreshToken);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Refresh token generated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const changePassword = async (req, res, next) => {
    try {
        const user = req.user;
        const result = await auth_services_1.AuthService.changePassword(user, req.body);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Password changed successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const forgetPassword = async (req, res, next) => {
    try {
        const result = await auth_services_1.AuthService.forgetPassword(req.body);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Password reset link sent successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const resetPassword = async (req, res, next) => {
    try {
        const token = req.headers.authorization || "";
        const result = await auth_services_1.AuthService.resetPassword(token, req.body);
        res.status(http_status_1.default.OK).json({
            success: true,
            message: "Password reset successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.AuthController = {
    logInUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
// import { NextFunction, Request, Response } from "express";
// import { AuthService } from "./auth.services";
// import catchAsync from "../../shared/catchAsync";
// import httpStatus from "http-status";
// const logInUser = catchAsync(
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const result = await AuthService.logInUser(req.body);
//             const { refreshToken } = result;
//             res.cookie("refreshToken", refreshToken, {
//                 secure: false,
//                 httpOnly: true,
//             });
//             res.status(httpStatus.OK).json({
//                 success: true,
//                 message: "User logged in successfully",
//                 data: {
//                     accessToken: result.accessToken,
//                     needPasswordChange: result.needPasswordChange,
//                 },
//             });
//         } catch (error) {
//             next(error);
//         }
//     }
// );
// const refreshToken = catchAsync(
//     async (req: Request, res: Response, next: NextFunction) => {
//         const { refreshToken } = req.cookies;
//         const result = await AuthService.refreshToken(refreshToken);
//         // console.log(result);
//         res.status(httpStatus.OK).json({
//             success: true,
//             message: "refresh token",
//             data: result,
//         });
//     }
// );
// const changePassword = catchAsync(
//     async (
//         req: Request & { user?: any },
//         res: Response,
//         next: NextFunction
//     ) => {
//         const user = req.user;
//         const result = await AuthService.changePassword(user, req.body);
//         // console.log(result);
//         res.status(httpStatus.OK).json({
//             success: true,
//             message: "password changed successfully",
//             data: result,
//         });
//     }
// );
// const forgetPassword = catchAsync(
//     async (req: Request, res: Response, next: NextFunction) => {
//         const result = await AuthService.forgetPassword(req.body);
//         res.status(httpStatus.OK).json({
//             success: true,
//             message: "Password reset link sent successfully",
//             data: result,
//         });
//     }
// );
// const resetPassword = catchAsync(
//     async (req: Request, res: Response, next: NextFunction) => {
//         const token = req.headers.authorization || "";
//         const result = await AuthService.resetPassword(token, req.body);
//         res.status(httpStatus.OK).json({
//             success: true,
//             message: "Password reset successfully",
//             data: result,
//         });
//     }
// );
// export const AuthController = {
//     logInUser,
//     refreshToken,
//     changePassword,
//     forgetPassword,
//     resetPassword,
// };

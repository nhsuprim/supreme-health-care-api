import { NextFunction, Request, Response } from "express"
import { AuthService } from "./auth.services"
import catchAsync from "../../shared/catchAsync"
import httpStatus from "http-status"

const logInUser = catchAsync(async(req:Request,res:Response, next:NextFunction)=>{
    const result = await AuthService.logInUser(req.body);

    const {refreshToken} = result

    res.cookie("refreshToken", refreshToken,{
        secure: false,
        httpOnly: true,
    })

    res.status(httpStatus.OK).json({
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange,
            
        }
    })
})

const refreshToken = catchAsync(async(req:Request,res:Response, next:NextFunction)=>{

    const {refreshToken} = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);

    // console.log(result);

    res.status(httpStatus.OK).json({
        success: true,
        message: "refresh token",
        data: result
    })
})

const changePassword = catchAsync(async(req:Request & {user?: any},res:Response, next:NextFunction)=>{

    const user = req.user

    const result = await AuthService.changePassword(user, req.body);

    // console.log(result);

    res.status(httpStatus.OK).json({
        success: true,
        message: "password changed successfully",
        data: result
    })
})

const forgetPassword = catchAsync(async(req:Request,res:Response, next:NextFunction) => {
    const result = await AuthService.forgetPassword(req.body)
    res.status(httpStatus.OK).json({
        success: true,
        message: "Password reset link sent successfully",
        data: result
    })
})

const resetPassword = catchAsync(async(req:Request,res:Response, next:NextFunction) => {

    const token = req.headers.authorization || ""
    const result = await AuthService.resetPassword(token, req.body)
    res.status(httpStatus.OK).json({
        success: true,
        message: "Password reset successfully",
        data: result
    })
})

export const AuthController = {
    logInUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
}


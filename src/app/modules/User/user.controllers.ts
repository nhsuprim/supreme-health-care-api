import { NextFunction, Request, Response } from "express"
import { userServices } from "./user.services"
import catchAsync from "../../shared/catchAsync"
import pick from "../../shared/pick"
import { UserFilterableField } from "./user.constant"
import httpStatus from "http-status"

const createAdmin = async( req: Request, res: Response, next:NextFunction)=>{

    try {
        const result = await userServices.createAdmin(req)
    res.status(200).json({
        success: true,
        message: "Admin created successfully",
        data: result
    })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create Admin",
            error: error
        })
    }
} 

const createDoctor = async( req: Request, res: Response, next:NextFunction)=>{

    try {
        const result = await userServices.createDoctor(req)
    res.status(200).json({
        success: true,
        message: "Doctor created successfully",
        data: result
    })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create Doctor",
            error: error
        })
    }
} 

const createPatient = async( req: Request, res: Response, next:NextFunction)=>{

    try {
        const result = await userServices.createPatient(req)
    res.status(200).json({
        success: true,
        message: "Patient created successfully",
        data: result
    })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create Patient",
            error: error
        })
    }
} 


const getAllFromDb = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
     
    const filters = pick(req.query, UserFilterableField)
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
   const results = await userServices.getAllUser(filters, options)
   res.status(httpStatus.OK).json({
       success: true,
       message: " All users are successfully retrieved",
       meta: results.meta,
       data: results.data,
   })
})

const updateUserStatus = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        //  console.log(req.params);
        const result = await userServices.updateUserStatus(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: "User Status successfully updated",
            data: result
        })
    } catch (error) {
        next(error);
    }
}


export const userControllers ={
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDb,
    updateUserStatus
}
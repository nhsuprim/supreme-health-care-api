import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.services";
import pick from "../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";


const getAllFromDb = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
     
         const filters = pick(req.query, adminFilterableFields)
         const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
        const results = await AdminService.getAllAdmins(filters, options)
        res.status(httpStatus.OK).json({
            success: true,
            message: " All admins are successfully retrieved",
            meta: results.meta,
            data: results.data,
        })
})

const getById = async(req:Request, res:Response, next:NextFunction)=>{
    try {
         
        const result = await AdminService.getById(req.params.id)
        res.status(200).json({
            success: true,
            message: "Admin successfully retrieved by id",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        //  console.log(req.params);
        const result = await AdminService.update(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: "Admin successfully updated",
            data: result
        })
    } catch (error) {
        next(error);
    }
}

const deleteAdmin = async(req:Request, res:Response,next: NextFunction)=>{
    try {
        //  console.log(req.params);
        const result = await AdminService.deleteAdmin(req.params.id)
        res.status(200).json({
            success: true,
            message: "Admin successfully deleted",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const softDeleteAdmin = async(req:Request, res:Response, next: NextFunction)=>{
    try {
        //  console.log(req.params);
        const result = await AdminService.softDeleteAdmin(req.params.id)
        res.status(200).json({
            success: true,
            message: "Admin successfully deleted",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const AdminController = {
    getAllFromDb,
    getById,
    update,
    deleteAdmin,
    softDeleteAdmin
}
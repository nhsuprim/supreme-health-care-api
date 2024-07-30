import { Request, Response } from "express";
import { AdminService } from "./admin.services";
import pick from "../../shared/pick";
import { adminFilterableFields } from "./admin.constant";



const getAllFromDb = async(req:Request, res:Response)=>{
    try {
         
         const filters = pick(req.query, adminFilterableFields)
         const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
        const results = await AdminService.getAllAdmins(filters, options)
        res.status(200).json({
            success: true,
            message: " All admins are successfully retrieved",
            data: results
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve admins",
            error: error
        })
    }
}

export const AdminController = {
    getAllFromDb
}
import { Request, Response } from "express"
import { userServices } from "./user.services"

const createAdmin = async( req: Request, res: Response)=>{
    console.log(req.body);
    const result = await userServices.createAdmin(req.body)
    res.status(200).json(result)
} 

export const userControllers ={
    createAdmin
}
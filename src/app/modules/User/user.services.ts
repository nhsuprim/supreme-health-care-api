import { UserRole } from "@prisma/client"
import * as bcrypt from "bcrypt"
import prisma from "../../shared/prisma"
import { fileUploader } from "../../helpers/fileUploaders"
import { IFile } from "../../interface/file"

const createAdmin = async(req: any)=>{

    const file:IFile = req.file


    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url 
        console.log(req.body);
        }
        
    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const UserData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }
    const result = await prisma.$transaction(async (transactionClient) =>{
        await transactionClient.user.create({
            data: UserData,
        })

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        })
        return createdAdminData
    })

    return result
}
export const userServices = {
    createAdmin
}
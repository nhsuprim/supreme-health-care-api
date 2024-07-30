import { UserRole } from "@prisma/client"
import * as bcrypt from "bcrypt"
import prisma from "../../shared/prisma"

const createAdmin = async(data: any)=>{

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const UserData = {
        email: data.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }
    const result = await prisma.$transaction(async (transactionClient) =>{
        await transactionClient.user.create({
            data: UserData,
        })

        const createdAdminData = await transactionClient.admin.create({
            data: data.admin
        })
        return createdAdminData
    })

    return result
}
export const userServices = {
    createAdmin
}
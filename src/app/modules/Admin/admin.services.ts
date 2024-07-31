import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSeachField } from "./admin.constant";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import prisma from "../../shared/prisma";
import { cachedDataVersionTag } from "v8";

const getAllAdmins = async(params: any, options:any)=>{
    
    const andConditions : Prisma.AdminWhereInput[] = []

    const {searchTerm, ...filteredData} = params;
    const {limit, page, skip} = paginationHelpers.calculatePagination(options);


    if (params.searchTerm){
        andConditions.push({
            OR: adminSeachField.map(field =>({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                }
            }))
        })
    }

    if(Object.keys(filteredData).length > 0){
        andConditions.push({
            AND: Object.keys(filteredData).map(key => ({
                [key]: {
                    equals: filteredData[key],
                }
            }))
        })
    }
    andConditions.push({
        isDeleted: false
    })

    const conditions: Prisma.AdminWhereInput ={AND: andConditions} 

    const results = await prisma.admin.findMany({
        where: conditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        }: {
            createdAt: 'desc'
        }
    })

    

    const total = await prisma.admin.count({where: conditions})
    return {
        meta:{
            page,
            limit,
            total
        },
        data: results,
    }

}

const getById = async(id: string) : Promise<Admin | null> =>{
    const result =  await prisma.admin.findUniqueOrThrow({
        where: {
            id:id,
            isDeleted: false
        }
    })
    return result
}

const update = async(id: string, data: Partial<Admin>): Promise<Admin | null> =>{

    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.admin.update({
        where: {
            id,
            isDeleted: false
        },
        data
    })
    return result
}

const deleteAdmin = async(id: string): Promise<Admin | null> =>{
    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })

    const result  = await prisma.$transaction(async(transactionClient )=>{
        const adminDeletedData = await transactionClient.admin.delete({
            where: {
                id
            }
        })
        const userDeletedData = await transactionClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        })
        return adminDeletedData
    })
    return result
}

const softDeleteAdmin = async(id: string): Promise<Admin | null> =>{
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })
    
    const result  = await prisma.$transaction(async(transactionClient )=>{
        const adminDeletedData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })
        const userDeletedData = await transactionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data:{
                status: UserStatus.DELETED,
            }
        })
        return adminDeletedData
    })
    return result
}
export const AdminService = {
    getAllAdmins,
    getById,
    update,
    deleteAdmin,
    softDeleteAdmin
}
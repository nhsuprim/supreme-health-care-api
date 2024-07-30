import { Prisma } from "@prisma/client";
import { adminSeachField } from "./admin.constant";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import prisma from "../../shared/prisma";

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
    return results

}
export const AdminService = {
    getAllAdmins
}
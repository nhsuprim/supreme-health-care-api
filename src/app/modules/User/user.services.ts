import { Admin, Doctor, Patient, Prisma, UserRole, UserStatus } from "@prisma/client"
import * as bcrypt from "bcrypt"
import prisma from "../../shared/prisma"
import { fileUploader } from "../../helpers/fileUploaders"
import { IFile } from "../../interface/file"
import express, { Request } from "express"
import { paginationHelpers } from "../../helpers/paginationHelpers"
import { userSeachField } from "./user.constant"

const createAdmin = async(req: Request): Promise<Admin> =>{

    const file = req.file as IFile

    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url 
        
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

const createDoctor = async(req: Request): Promise<Doctor> =>{

    const file = req.file as IFile


    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url 
        
        }
        
    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const UserData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }
    const result = await prisma.$transaction(async (transactionClient) =>{
        await transactionClient.user.create({
            data: UserData,
        })

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        })
        return createdDoctorData
    })

    return result
}

const createPatient = async(req: Request): Promise<Patient> =>{

    const file = req.file as IFile


    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.patient.profilePhoto = uploadToCloudinary?.secure_url 
        
        }
        
    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const UserData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }
    const result = await prisma.$transaction(async (transactionClient) =>{
        await transactionClient.user.create({
            data: UserData,
        })

        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        })
        return createdPatientData
    })

    return result
}

const getAllUser = async(params: any, options:any)=>{
    
    const andConditions : Prisma.UserWhereInput[] = []

    const {searchTerm, ...filteredData} = params;
    const {limit, page, skip} = paginationHelpers.calculatePagination(options);


    if (params.searchTerm){
        andConditions.push({
            OR: userSeachField.map(field =>({
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
    // andConditions.push({
    //     isDeleted: false
    // })

    const conditions: Prisma.UserWhereInput = andConditions.length > 0 ? {AND: andConditions} : {}

    const results = await prisma.user.findMany({
        where: conditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        }: {
            createdAt: 'desc'
        },
        select:{
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            doctor: true,
            patient: true

        }
    })

    

    const total = await prisma.user.count({where: conditions})
    return {
        meta:{
            page,
            limit,
            total
        },
        data: results,
    }

}

const updateUserStatus = async(id: string, status: UserRole) =>{

    await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.user.update({
        where: {
            id,
        },
        data:status 
    })
    return result
}



export const userServices = {
    createAdmin,
    createDoctor, 
    createPatient,
    getAllUser,
    updateUserStatus
}
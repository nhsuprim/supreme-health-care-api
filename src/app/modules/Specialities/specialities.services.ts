import { Request } from "express";
import { IFile } from "../../interface/file";
import { fileUploader } from "../../helpers/fileUploaders";
import prisma from "../../shared/prisma";
import { Prisma } from "@prisma/client";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { SpecialitiesFilterableFields } from "./specialities.constant";

const insertToDb = async (req: Request) => {
    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }

    const result = await prisma.specialities.create({
        data: req.body,
    });

    return result;
};

const getAllfromDB = async (params: any, options: any) => {
    const andConditions: Prisma.SpecialitiesWhereInput[] = [];

    const { searchTerm, ...filteredData } = params;
    const { limit, page, skip } =
        paginationHelpers.calculatePagination(options);

    if (params.searchTerm) {
        andConditions.push({
            OR: SpecialitiesFilterableFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filteredData).length > 0) {
        andConditions.push({
            AND: Object.keys(filteredData).map((key) => ({
                [key]: {
                    equals: filteredData[key],
                },
            })),
        });
    }
    // andConditions.push({
    //     isDeleted: false,
    // });

    const conditions: Prisma.SpecialitiesWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const results = await prisma.specialities.findMany({
        where: conditions,
        skip,
        take: limit,
        // orderBy:
        //     options.sortBy && options.sortOrder
        //         ? {
        //               [options.sortBy]: options.sortOrder,
        //           }
        //         : {
        //               createdAt: "desc",
        //           },
    });

    const total = await prisma.specialities.count({ where: conditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: results,
    };
};

const updateInDb = async (id: string, data: any, file?: IFile) => {
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        data.icon = uploadToCloudinary?.secure_url;
    }

    const result = await prisma.specialities.update({
        where: {
            id,
        },
        data,
    });

    return result;
};

const deletefromDB = async (id: any) => {
    const result = await prisma.specialities.delete({
        where: {
            id,
        },
    });
    return result;
};

export const SpecialitiesService = {
    insertToDb,
    getAllfromDB,
    updateInDb,
    deletefromDB,
};

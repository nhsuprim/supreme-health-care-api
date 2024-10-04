"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialitiesService = void 0;
const fileUploaders_1 = require("../../helpers/fileUploaders");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const specialities_constant_1 = require("./specialities.constant");
const insertToDb = async (req) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }
    const result = await prisma_1.default.specialities.create({
        data: req.body,
    });
    return result;
};
const getAllfromDB = async (params, options) => {
    const andConditions = [];
    const { searchTerm, ...filteredData } = params;
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    if (params.searchTerm) {
        andConditions.push({
            OR: specialities_constant_1.SpecialitiesFilterableFields.map((field) => ({
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
    const conditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const results = await prisma_1.default.specialities.findMany({
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
    const total = await prisma_1.default.specialities.count({ where: conditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: results,
    };
};
const updateInDb = async (id, data, file) => {
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        data.icon = uploadToCloudinary?.secure_url;
    }
    const result = await prisma_1.default.specialities.update({
        where: {
            id,
        },
        data,
    });
    return result;
};
const deletefromDB = async (id) => {
    const result = await prisma_1.default.specialities.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.SpecialitiesService = {
    insertToDb,
    getAllfromDB,
    updateInDb,
    deletefromDB,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const admin_constant_1 = require("./admin.constant");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllAdmins = async (params, options) => {
    const andConditions = [];
    const { searchTerm, ...filteredData } = params;
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    if (params.searchTerm) {
        andConditions.push({
            OR: admin_constant_1.adminSeachField.map((field) => ({
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
    andConditions.push({
        isDeleted: false,
    });
    const conditions = { AND: andConditions };
    const results = await prisma_1.default.admin.findMany({
        where: conditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = await prisma_1.default.admin.count({ where: conditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: results,
    };
};
const getById = async (id) => {
    const result = await prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
};
const update = async (id, data) => {
    await prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = await prisma_1.default.admin.update({
        where: {
            id,
            isDeleted: false,
        },
        data,
    });
    return result;
};
const deleteAdmin = async (id) => {
    await prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where: {
                id,
            },
        });
        const userDeletedData = await transactionClient.user.delete({
            where: {
                email: adminDeletedData.email,
            },
        });
        return adminDeletedData;
    });
    return result;
};
const softDeleteAdmin = async (id) => {
    await prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        const userDeletedData = await transactionClient.user.update({
            where: {
                email: adminDeletedData.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return adminDeletedData;
    });
    return result;
};
exports.AdminService = {
    getAllAdmins,
    getById,
    update,
    deleteAdmin,
    softDeleteAdmin,
};

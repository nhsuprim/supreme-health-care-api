"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const admin_constant_1 = require("./admin.constant");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllAdmins = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const andConditions = [];
    const { searchTerm } = params, filteredData = __rest(params, ["searchTerm"]);
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
    const results = yield prisma_1.default.admin.findMany({
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
    const total = yield prisma_1.default.admin.count({ where: conditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: results,
    };
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
});
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.admin.update({
        where: {
            id,
            isDeleted: false,
        },
        data,
    });
    return result;
});
const deleteAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeletedData = yield transactionClient.admin.delete({
            where: {
                id,
            },
        });
        const userDeletedData = yield transactionClient.user.delete({
            where: {
                email: adminDeletedData.email,
            },
        });
        return adminDeletedData;
    }));
    return result;
});
const softDeleteAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const adminDeletedData = yield transactionClient.admin.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        const userDeletedData = yield transactionClient.user.update({
            where: {
                email: adminDeletedData.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return adminDeletedData;
    }));
    return result;
});
exports.AdminService = {
    getAllAdmins,
    getById,
    update,
    deleteAdmin,
    softDeleteAdmin,
};

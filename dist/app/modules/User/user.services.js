"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fileUploaders_1 = require("../../helpers/fileUploaders");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const user_constant_1 = require("./user.constant");
const createAdmin = async (req) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const UserData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: client_1.UserRole.ADMIN,
    };
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: UserData,
        });
        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin,
        });
        return createdAdminData;
    });
    return result;
};
const createDoctor = async (req) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const UserData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: client_1.UserRole.DOCTOR,
    };
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: UserData,
        });
        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor,
        });
        return createdDoctorData;
    });
    return result;
};
const createPatient = async (req) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const UserData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: client_1.UserRole.PATIENT,
    };
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: UserData,
        });
        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient,
        });
        return createdPatientData;
    });
    return result;
};
const getAllUser = async (params, options) => {
    const andConditions = [];
    const { searchTerm, ...filteredData } = params;
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    if (params.searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSeachField.map((field) => ({
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
    //     isDeleted: false
    // })
    const conditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const results = await prisma_1.default.user.findMany({
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
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            doctor: true,
            patient: true,
        },
    });
    const total = await prisma_1.default.user.count({ where: conditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: results,
    };
};
const updateUserStatus = async (id, status) => {
    console.log(status);
    await prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = await prisma_1.default.user.update({
        where: {
            id,
        },
        data: status,
    });
    return result;
};
const getMyProfile = async (user) => {
    const userInfo = await prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user?.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
        },
    });
    let userProfile;
    if (userInfo.role === "ADMIN") {
        userProfile = await prisma_1.default.admin.findFirstOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    if (userInfo.role === "DOCTOR") {
        userProfile = await prisma_1.default.admin.findFirstOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    if (userInfo.role === "PATIENT") {
        userProfile = await prisma_1.default.admin.findFirstOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    if (userInfo.role === "SUPERADMIN") {
        userProfile = await prisma_1.default.admin.findFirstOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    return { ...userInfo, ...userProfile };
};
const updateProfile = async (user, req) => {
    const userInfo = await prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user?.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }
    let userProfile;
    if (userInfo.role === "ADMIN") {
        userProfile = await prisma_1.default.admin.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    if (userInfo.role === "DOCTOR") {
        userProfile = await prisma_1.default.admin.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    if (userInfo.role === "PATIENT") {
        userProfile = await prisma_1.default.admin.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    if (userInfo.role === "SUPERADMIN") {
        userProfile = await prisma_1.default.admin.update({
            where: {
                email: userInfo.email,
            },
            data: req.body,
        });
    }
    return { ...userProfile };
};
exports.userServices = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUser,
    getMyProfile,
    updateUserStatus,
    updateProfile,
};

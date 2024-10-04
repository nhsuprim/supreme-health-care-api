"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientServices = void 0;
const client_1 = require("@prisma/client");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const patient_constant_1 = require("./patient.constant");
const getAllfromDB = async (params, options) => {
    const andConditions = [];
    const { searchTerm, ...filteredData } = params;
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    if (params.searchTerm) {
        andConditions.push({
            OR: patient_constant_1.patientSearchableFields.map((field) => ({
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
    const conditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const results = await prisma_1.default.patient.findMany({
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
        include: {
            patientHealthData: true,
            medicalReport: true,
        },
    });
    const total = await prisma_1.default.patient.count({ where: conditions });
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
    const result = await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
};
const deletePatient = async (id) => {
    await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        await transactionClient.patientHealthData.delete({
            where: {
                patientId: id,
            },
        });
        await transactionClient.medicalReport.deleteMany({
            where: {
                patientId: id,
            },
        });
        const deletedPatientData = await transactionClient.patient.delete({
            where: {
                id,
            },
        });
        await transactionClient.user.delete({
            where: {
                email: deletedPatientData.email,
            },
        });
        return deletedPatientData;
    });
    return result;
};
const softDeletePatient = async (id) => {
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        const patientDeletedData = await transactionClient.patient.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        await transactionClient.user.update({
            where: {
                email: patientDeletedData.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return patientDeletedData;
    });
    return result;
};
const updatePatient = async (id, payload) => {
    const { patientHealthData, medicalReportData, ...patientData } = payload;
    const patientInfo = await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });
    await prisma_1.default.$transaction(async (transactionClient) => {
        await transactionClient.patient.update({
            where: {
                id,
            },
            data: patientData,
            include: {
                patientHealthData: true,
                medicalReport: true,
            },
        });
        // create or update patient health data
        if (patientHealthData) {
            await transactionClient.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id,
                },
                create: {
                    patientId: patientInfo.id,
                    ...patientHealthData,
                },
                update: patientHealthData,
            });
        }
        // create medical report
        if (medicalReportData) {
            await transactionClient.medicalReport.create({
                data: {
                    patientId: patientInfo.id,
                    ...medicalReportData,
                },
            });
        }
    });
    const responseData = await prisma_1.default.patient.findUnique({
        where: {
            id,
        },
        include: {
            patientHealthData: true,
            medicalReport: true,
        },
    });
    return responseData;
};
exports.PatientServices = {
    getAllfromDB,
    getById,
    updatePatient,
    deletePatient,
    softDeletePatient,
};

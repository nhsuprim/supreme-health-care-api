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
exports.PatientServices = void 0;
const client_1 = require("@prisma/client");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const patient_constant_1 = require("./patient.constant");
const getAllfromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const andConditions = [];
    const { searchTerm } = params, filteredData = __rest(params, ["searchTerm"]);
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
    const results = yield prisma_1.default.patient.findMany({
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
    const total = yield prisma_1.default.patient.count({ where: conditions });
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
    const result = yield prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
});
const deletePatient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.patientHealthData.delete({
            where: {
                patientId: id,
            },
        });
        yield transactionClient.medicalReport.deleteMany({
            where: {
                patientId: id,
            },
        });
        const deletedPatientData = yield transactionClient.patient.delete({
            where: {
                id,
            },
        });
        yield transactionClient.user.delete({
            where: {
                email: deletedPatientData.email,
            },
        });
        return deletedPatientData;
    }));
    return result;
});
const softDeletePatient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const patientDeletedData = yield transactionClient.patient.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        yield transactionClient.user.update({
            where: {
                email: patientDeletedData.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return patientDeletedData;
    }));
    return result;
});
const updatePatient = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientHealthData, medicalReportData } = payload, patientData = __rest(payload, ["patientHealthData", "medicalReportData"]);
    const patientInfo = yield prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.patient.update({
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
            yield transactionClient.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id,
                },
                create: Object.assign({ patientId: patientInfo.id }, patientHealthData),
                update: patientHealthData,
            });
        }
        // create medical report
        if (medicalReportData) {
            yield transactionClient.medicalReport.create({
                data: Object.assign({ patientId: patientInfo.id }, medicalReportData),
            });
        }
    }));
    const responseData = yield prisma_1.default.patient.findUnique({
        where: {
            id,
        },
        include: {
            patientHealthData: true,
            medicalReport: true,
        },
    });
    return responseData;
});
exports.PatientServices = {
    getAllfromDB,
    getById,
    updatePatient,
    deletePatient,
    softDeletePatient,
};

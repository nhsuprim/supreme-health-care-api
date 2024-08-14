import { Patient, Prisma, UserStatus } from "@prisma/client";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import prisma from "../../shared/prisma";
import { patientSearchableFields } from "./patient.constant";
import { IPatientUpdate } from "./patient.interface";

const getAllfromDB = async (params: any, options: any) => {
    const andConditions: Prisma.PatientWhereInput[] = [];

    const { searchTerm, ...filteredData } = params;
    const { limit, page, skip } =
        paginationHelpers.calculatePagination(options);

    if (params.searchTerm) {
        andConditions.push({
            OR: patientSearchableFields.map((field) => ({
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

    const conditions: Prisma.PatientWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const results = await prisma.patient.findMany({
        where: conditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
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

    const total = await prisma.patient.count({ where: conditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: results,
    };
};

const getById = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
};

const deletePatient = async (id: string): Promise<Patient | null> => {
    await prisma.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.$transaction(async (transactionClient) => {
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

const softDeletePatient = async (id: string): Promise<Patient | null> => {
    const result = await prisma.$transaction(async (transactionClient) => {
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
                status: UserStatus.DELETED,
            },
        });
        return patientDeletedData;
    });
    return result;
};

const updatePatient = async (
    id: string,
    payload: Partial<IPatientUpdate>
): Promise<Patient | null> => {
    const { patientHealthData, medicalReportData, ...patientData } = payload;

    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            id,
        },
    });

    await prisma.$transaction(async (transactionClient) => {
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

    const responseData = await prisma.patient.findUnique({
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

export const PatientServices = {
    getAllfromDB,
    getById,
    updatePatient,
    deletePatient,
    softDeletePatient,
};

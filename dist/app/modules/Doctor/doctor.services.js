"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorServices = void 0;
const client_1 = require("@prisma/client");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const doctor_constant_1 = require("./doctor.constant");
const getAllDoctor = async (params, options) => {
    const andConditions = [];
    const { searchTerm, specialities, ...filteredData } = params;
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    if (searchTerm) {
        andConditions.push({
            OR: doctor_constant_1.doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (specialities && specialities.length > 0) {
        andConditions.push({
            doctorSpecialities: {
                some: {
                    specialities: {
                        title: {
                            contains: specialities,
                            mode: "insensitive",
                        },
                    },
                },
            },
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
    const results = await prisma_1.default.doctor.findMany({
        where: conditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                averageRating: "desc",
            },
        include: {
            doctorSpecialities: {
                include: {
                    specialities: true,
                },
            },
        },
    });
    const total = await prisma_1.default.doctor.count({ where: conditions });
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
    const result = await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
};
const deleteDoctor = async (id) => {
    await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        const doctorDeletedData = await transactionClient.doctor.delete({
            where: {
                id,
            },
        });
        await transactionClient.user.delete({
            where: {
                email: doctorDeletedData.email,
            },
        });
        return doctorDeletedData;
    });
    return result;
};
const softDeleteDoctor = async (id) => {
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        const doctorDeletedData = await transactionClient.doctor.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        await transactionClient.user.update({
            where: {
                email: doctorDeletedData.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return doctorDeletedData;
    });
    return result;
};
const updateDoctor = async (id, payload) => {
    const { specialities, ...doctorData } = payload;
    const doctorInfo = await prisma_1.default.doctor.findFirstOrThrow({
        where: {
            id,
        },
    });
    await prisma_1.default.$transaction(async (transactionClient) => {
        const updatedDoctorInfo = await prisma_1.default.doctor.update({
            where: {
                id,
            },
            data: doctorData,
            include: {
                doctorSpecialities: true,
            },
        });
        if (specialities && specialities.length > 0) {
            const deleteSpecialities = specialities.filter((speciality) => speciality.isDeleted);
            for (const speciality of specialities) {
                const createDoctorSpecialities = await transactionClient.doctorSpecialities.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: speciality.specialitiesId,
                    },
                });
            }
            const createDoctorSpecialities = specialities.filter((speciality) => !speciality.isDeleted);
            for (const speciality of createDoctorSpecialities) {
                const createDoctorSpecialities = await transactionClient.doctorSpecialities.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialitiesId: speciality.specialitiesId,
                    },
                });
            }
        }
        return updatedDoctorInfo;
    });
    const result = await prisma_1.default.doctor.findUnique({
        where: {
            id: doctorInfo.id,
        },
        include: {
            doctorSpecialities: {
                include: {
                    specialities: true,
                },
            },
        },
    });
    return result;
    // return result;
    //     const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    //         where: {
    //             id,
    //         },
    //     });
    //     await prisma.$transaction(async (transactionClient) => {
    //         await transactionClient.doctor.update({
    //             where: {
    //                 id,
    //             },
    //             data: doctorData,
    //         });
    //         if (specialities && specialities.length > 0) {
    //             const deleteSpecialities = specialities.filter(
    //                 (speciality) => speciality.isDeleted
    //             );
    //             for (const speciality of deleteSpecialities) {
    //                 await transactionClient.doctorSpecialities.deleteMany({
    //                     where: {
    //                         doctorId: id,
    //                         specialitiesId: speciality.specialities.id,
    //                     },
    //                 });
    //             }
    //             const createSpecialities = specialities.filter(
    //                 (speciality) => !speciality.isDeleted
    //             );
    //             for (const speciality of createSpecialities) {
    //                 await transactionClient.doctorSpecialities.create({
    //                     data: {
    //                         doctorId: doctorInfo.id,
    //                         specialitiesId: speciality.specialities.id,
    //                     },
    //                 });
    //             }
    //         }
    //     });
    //     const result = await prisma.doctor.findUnique({
    //         where: {
    //             id: doctorInfo.id,
    //         },
    //         include: {
    //             doctorSpecialities: {
    //                 include: {
    //                     specialities: true,
    //                 },
    //             },
    //         },
    //     });
    //     return result;
    // };
    // const updateDoctor = async (id: string, payload: any) => {
    //     const { specialties, ...doctorData } = payload;
    //     const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    //         where: {
    //             id,
    //         },
    //     });
    //     await prisma.$transaction(async (transactionClient) => {
    //         await transactionClient.doctor.update({
    //             where: {
    //                 id,
    //             },
    //             data: doctorData,
    //         });
    //         if (specialties && specialties.length > 0) {
    //             // delete specialties
    //             const deleteSpecialtiesIds = specialties.filter(
    //                 (specialty) => specialty.isDeleted
    //             );
    //             //console.log(deleteSpecialtiesIds)
    //             for (const specialty of deleteSpecialtiesIds) {
    //                 await transactionClient.doctorSpecialities.deleteMany({
    //                     where: {
    //                         doctorId: doctorInfo.id,
    //                         specialitiesId: specialty.specialitiesId,
    //                     },
    //                 });
    //             }
    //             // create specialties
    //             const createSpecialitiesIds = specialties.filter(
    //                 (specialty) => !specialty.isDeleted
    //             );
    //             console.log(createSpecialitiesIds);
    //             for (const specialty of createSpecialitiesIds) {
    //                 await transactionClient.doctorSpecialities.create({
    //                     data: {
    //                         doctorId: doctorInfo.id,
    //                         specialitiesId: specialty.specialitiesId,
    //                     },
    //                 });
    //             }
    //         }
    //     });
    //     const result = await prisma.doctor.findUnique({
    //         where: {
    //             id: doctorInfo.id,
    //         },
    //         include: {
    //             doctorSpecialities: {
    //                 include: {
    //                     specialities: true,
    //                 },
    //             },
    //         },
    //     });
    //     return result;
};
exports.DoctorServices = {
    getAllDoctor,
    getById,
    softDeleteDoctor,
    deleteDoctor,
    updateDoctor,
};

import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import prisma from "../../shared/prisma";
import { doctorSearchableFields } from "./doctor.constant";

const getAllDoctor = async (params: any, options: any) => {
    const andConditions: Prisma.DoctorWhereInput[] = [];

    const { searchTerm, specialities, ...filteredData } = params;
    const { limit, page, skip } =
        paginationHelpers.calculatePagination(options);

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
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

    const conditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const results = await prisma.doctor.findMany({
        where: conditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
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

    const total = await prisma.doctor.count({ where: conditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: results,
    };
};

const getById = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
};

const deleteDoctor = async (id: string): Promise<Doctor | null> => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.$transaction(async (transactionClient) => {
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

const softDeleteDoctor = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.$transaction(async (transactionClient) => {
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
                status: UserStatus.DELETED,
            },
        });
        return doctorDeletedData;
    });
    return result;
};

const updateDoctor = async (id: string, payload: any) => {
    const { specialities, ...doctorData } = payload;

    const doctorInfo = await prisma.doctor.findFirstOrThrow({
        where: {
            id,
        },
    });

    await prisma.$transaction(async (transactionClient) => {
        const updatedDoctorInfo = await prisma.doctor.update({
            where: {
                id,
            },
            data: doctorData,
            include: {
                doctorSpecialities: true,
            },
        });

        if (specialities && specialities.length > 0) {
            const deleteSpecialities = specialities.filter(
                (speciality) => speciality.isDeleted
            );

            for (const speciality of specialities) {
                const createDoctorSpecialities =
                    await transactionClient.doctorSpecialities.deleteMany({
                        where: {
                            doctorId: doctorInfo.id,
                            specialitiesId: speciality.specialitiesId,
                        },
                    });
            }

            const createDoctorSpecialities = specialities.filter(
                (speciality) => !speciality.isDeleted
            );
            for (const speciality of createDoctorSpecialities) {
                const createDoctorSpecialities =
                    await transactionClient.doctorSpecialities.create({
                        data: {
                            doctorId: doctorInfo.id,
                            specialitiesId: speciality.specialitiesId,
                        },
                    });
            }
        }

        return updatedDoctorInfo;
    });

    const result = await prisma.doctor.findUnique({
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

export const DoctorServices = {
    getAllDoctor,
    getById,
    softDeleteDoctor,
    deleteDoctor,
    updateDoctor,
};

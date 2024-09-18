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
exports.DoctorServices = void 0;
const client_1 = require("@prisma/client");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const doctor_constant_1 = require("./doctor.constant");
const getAllDoctor = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const andConditions = [];
    const { searchTerm, specialities } = params, filteredData = __rest(params, ["searchTerm", "specialities"]);
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
    const results = yield prisma_1.default.doctor.findMany({
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
    const total = yield prisma_1.default.doctor.count({ where: conditions });
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
    const result = yield prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
});
const deleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const doctorDeletedData = yield transactionClient.doctor.delete({
            where: {
                id,
            },
        });
        yield transactionClient.user.delete({
            where: {
                email: doctorDeletedData.email,
            },
        });
        return doctorDeletedData;
    }));
    return result;
});
const softDeleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const doctorDeletedData = yield transactionClient.doctor.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        yield transactionClient.user.update({
            where: {
                email: doctorDeletedData.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return doctorDeletedData;
    }));
    return result;
});
const updateDoctor = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialities } = payload, doctorData = __rest(payload, ["specialities"]);
    const doctorInfo = yield prisma_1.default.doctor.findFirstOrThrow({
        where: {
            id,
        },
    });
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedDoctorInfo = yield prisma_1.default.doctor.update({
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
                const createDoctorSpecialities = yield transactionClient.doctorSpecialities.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: speciality.specialitiesId,
                    },
                });
            }
            const createDoctorSpecialities = specialities.filter((speciality) => !speciality.isDeleted);
            for (const speciality of createDoctorSpecialities) {
                const createDoctorSpecialities = yield transactionClient.doctorSpecialities.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialitiesId: speciality.specialitiesId,
                    },
                });
            }
        }
        return updatedDoctorInfo;
    }));
    const result = yield prisma_1.default.doctor.findUnique({
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
});
exports.DoctorServices = {
    getAllDoctor,
    getById,
    softDeleteDoctor,
    deleteDoctor,
    updateDoctor,
};

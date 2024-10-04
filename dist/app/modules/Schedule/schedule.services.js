"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const inserIntoDB = async (payload) => {
    const { startDate, endDate, startTime, endTime } = payload;
    const interverlTime = 30;
    const schedules = [];
    const currentDate = new Date(startDate); // start date
    const lastDate = new Date(endDate); // end date
    while (currentDate <= lastDate) {
        // 09:30  ---> ['09', '30']
        const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(startTime.split(":")[0])), Number(startTime.split(":")[1])));
        const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(endTime.split(":")[0])), Number(endTime.split(":")[1])));
        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: (0, date_fns_1.addMinutes)(startDateTime, interverlTime),
            };
            const existingSchedule = await prisma_1.default.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime,
                },
            });
            if (!existingSchedule) {
                const result = await prisma_1.default.schedule.create({
                    data: scheduleData,
                });
                schedules.push(result);
            }
            startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedules;
};
const getFromDB = async (filters, options, user) => {
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;
    const andConditions = [];
    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate,
                    },
                },
                {
                    endDateTime: {
                        lte: endDate,
                    },
                },
            ],
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const doctorSchedules = await prisma_1.default.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user?.email,
            },
        },
    });
    const doctorScheduleIds = doctorSchedules.map((schedule) => schedule.scheduleId);
    console.log(doctorScheduleIds);
    const result = await prisma_1.default.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds,
            },
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const total = await prisma_1.default.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds,
            },
        },
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
const getByIdFromDB = async (id) => {
    const result = await prisma_1.default.schedule.findUnique({
        where: {
            id,
        },
    });
    return result;
};
const deleteFromDB = async (id) => {
    const result = await prisma_1.default.schedule.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.ScheduleService = {
    inserIntoDB,
    getFromDB,
    getByIdFromDB,
    deleteFromDB,
};

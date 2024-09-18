"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAdmin = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required",
    }),
    admin: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        contactNumber: zod_1.z.string({
            required_error: "Contact Number is required",
        }),
        email: zod_1.z.string({
            required_error: "Email is required",
        }),
    }),
});
const createDoctor = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required",
    }),
    doctor: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        contactNumber: zod_1.z.string({
            required_error: "Contact Number is required",
        }),
        email: zod_1.z.string({
            required_error: "Email is required",
        }),
        address: zod_1.z.string().optional(),
        registrationNumber: zod_1.z.string({
            required_error: "registrationNumber is required",
        }),
        experience: zod_1.z.number().optional(),
        gender: zod_1.z.enum([client_1.Gender.MALE, client_1.Gender.FEMALE]),
        apointmentFee: zod_1.z.number({
            required_error: "apointmentFee is required",
        }),
        qualification: zod_1.z.string({
            required_error: "qualification is required",
        }),
        currentWorkingPlace: zod_1.z.string({
            required_error: "currentWorkingPlace is required",
        }),
        designation: zod_1.z.string({
            required_error: "designation is required",
        }),
    }),
});
const createPatient = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required",
    }),
    patient: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        contactNumber: zod_1.z.string().optional(),
        email: zod_1.z.string({
            required_error: "Email is required",
        }),
        address: zod_1.z.string().optional(),
    }),
});
exports.userValidation = {
    createAdmin,
    createDoctor,
    createPatient,
};

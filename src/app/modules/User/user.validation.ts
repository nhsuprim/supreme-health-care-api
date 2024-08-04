import { Gender } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    admin: z.object({
        name: z.string({
            required_error: "Name is required"
        }),
        contactNumber: z.string({
            required_error: "Contact Number is required"
        }),
        email: z.string({
            required_error: "Email is required"
        })
    })
})

const createDoctor = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    doctor: z.object({
        name: z.string({
            required_error: "Name is required"
        }),

        contactNumber: z.string({
            required_error: "Contact Number is required"
        }),

        email: z.string({
            required_error: "Email is required"
        }),

        address: z.string().optional(),

        registrationNumber: z.string({
            required_error: "registrationNumber is required"
        }),

        experience: z.number().optional(),

        gender: z.enum([Gender.MALE, Gender.FEMALE]),

        apointmentFee: z.number({
            required_error: "apointmentFee is required"
        }),

        qualification: z.string({
            required_error: "qualification is required"
        }),

        currentWorkingPlace: z.string({
            required_error: "currentWorkingPlace is required"
        }),

        designation: z.string({
            required_error: "designation is required"
        }),

    })
})

const createPatient = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    patient: z.object({
        name: z.string({
            required_error: "Name is required"
        }),

        contactNumber: z.string().optional(),

        email: z.string({
            required_error: "Email is required"
        }),

        address: z.string().optional(),


    })
})


export const userValidation = {
    createAdmin,
    createDoctor,
    createPatient
}
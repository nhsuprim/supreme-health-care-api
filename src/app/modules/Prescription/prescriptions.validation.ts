import { z } from "zod";

const create = z.object({
    appointmentId: z.string({
        required_error: "Appointment Id is required",
    }),
    instructions: z.string({
        required_error: "Instructions is required",
    }),
    // followUpDate: z
    //     .string({
    //         required_error: "Follow-up date is required",
    //     })
    //     .transform((str) => new Date(str)), // Transform the date string to a Date object
});

export const PrescriptionValidation = {
    create,
};

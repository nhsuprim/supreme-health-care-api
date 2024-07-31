import { z } from "zod";

const update = z.object({
    name: z.string(),
    contactNumber: z.string()
});

export const AdminValidation = {
    update
}
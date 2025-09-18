import * as z from "zod";

export const userCreationValidation = z.object({
    username: z
        .string("not a string")
        .min(4, "username min 4 length")
        .max(15, "username max 15 length"),
    email: z.string().email("not a valid email!"),
    password: z
        .string()
        .min(6, "password min 6 length")
        .max(12, "password max 12 length"),
});
export const userLoginValidation = z.object({
    email: z.string().email("invalid email format"),
    password: z.string()
        .min(6, "password min 6 length")
        .max(12, "password max 12 length"),
});   
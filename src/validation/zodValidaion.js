import * as z from "zod";

export const UserCreationValidation = z.object({
  firstName: z
    .string("not a string")
    .min(2, "first name min 2 length")
    .max(15, "first name max 15 length"),
  lastName: z
    .string("not a string")
    .min(2, "last name min 2 length")
    .max(15, "last name max 15 length"),
  email: z.string().email("not valid email!"),
  password: z
    .string()
    .min(6, "password min 6 length!")
    .max(12, "password max 12 character!"),
});

export const loginUserValidation = z.object({
  email: z.string().email("this is not valid email type"),
  password: z
    .string("password should be string!")
    .min(4, "password min 4 length")
    .max(15, "password max 15 length"),
});

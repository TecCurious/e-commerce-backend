import * as z from "zod";

export const UserCreationValidation = z.object({
  username: z
    .string("not a string")
    .min(2, "username min 2 length")
    .max(15, "username max 15 length"),
  email: z.string().email("not valid email!"),
  password: z
    .string()
    .min(6, "password min 6 length!")
    .max(12, "password max 12 character!"),
});





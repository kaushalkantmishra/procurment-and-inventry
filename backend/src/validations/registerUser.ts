import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name should be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be 6+ characters"),
    role: z.enum(["admin", "employee"]),
  }),
});

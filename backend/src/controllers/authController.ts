// src/controllers/authController.ts
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/user.schema";
import { db } from "../db";
import * as jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const missingFields: string[] = [];

  // ❌ Check missing fields
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!name) missingFields.push("name");
  if (!role) missingFields.push("role");

  // If ANY field is missing → stop here
  if (missingFields.length > 0) {
    return res
      .status(400)
      .json(new ApiError(400, `${missingFields.join(" and ")} is required`));
  }

  // ❌ Now check invalid role
  const validRoles = ["admin", "employee"];

  if (!validRoles.includes(role)) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid role. Allowed: admin, employee"));
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((rows) => rows[0]);

  if (existingUser) {
    return res.status(409).json(new ApiError(409, "Email already registered"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
    })
    .returning();

  const { password: _, ...userWithoutPassword } = newUser;

  return res
    .status(201)
    .json(
      new ApiResponse(201, userWithoutPassword, "User registered successfully")
    );
});

// LOGIN USER
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    return res
      .status(400)
      .json(new ApiError(400, `${missingFields.join(" and ")} is required`));
  }

  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = userResult[0];

  if (!user) {
    return res.status(401).json(new ApiError(401, "Invalid email or password"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid email or password"));
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    (process.env.JWT_SECRET || "fallback-secret") as jwt.Secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
  );

  const { password: _, ...userWithoutPassword } = user;

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { user: userWithoutPassword, token },
        "User logged in successfully"
      )
    );
});

export { registerUser, loginUser };

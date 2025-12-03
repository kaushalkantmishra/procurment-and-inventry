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
  const { name, email, password, role, profile } = req.body;

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
      profile,
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

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        200,
        { user: userWithoutPassword, token },
        "User logged in successfully"
      )
    );
});

// LOGOUT USER
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 2️⃣ Clear cookie
  res.clearCookie("token", options);

  // 3️⃣ Send response
  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

//Change Password
const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    const missingFields = [];
    if (!password) missingFields.push("password");
    if (!newPassword) missingFields.push("newPassword");
    return res
      .status(400)
      .json(new ApiError(400, `${missingFields.join(" and ")} is required`));
  }

  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "Unauthorized request."));
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return res.status(401).json(new ApiError(401, "Unauthorized request."));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid old password"));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, user.id));

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

export { registerUser, loginUser, logoutUser, changePassword };

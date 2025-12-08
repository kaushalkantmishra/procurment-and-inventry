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
import { isValidEmail } from "../helper/checkValid";

// REGISTER USER
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, profile } = req.body;

  const missingFields: string[] = [];

  // ❌ Check missing fields
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!name) missingFields.push("name");
  if (!role) missingFields.push("role");

  if (!isValidEmail(email)) {
    return res.status(400).json(new ApiError(400, "Invalid email format"));
  }

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
    return res.status(401).json(new ApiError(401, "Invalid Credentials"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid Credentials"));
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
    maxAge: 1 * 24 * 60 * 60 * 1000,
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
    maxAge: 1 * 24 * 60 * 60 * 1000,
  };

  res.clearCookie("token", options);

  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

// CHANGE PASSWORD
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

// UPDATE PROFILE
const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json(new ApiError(400, "Unauthorized request."));
  }

  const { name, profile, email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json(new ApiError(400, "Invalid email format"));
  }

  const updatedUser = await db
    .update(users)
    .set({ name, profile, email })
    .where(eq(users.id, userId));

  if (!updatedUser) {
    return res.status(500).json(new ApiError(500, "Unable to update profile"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Profile updated successfully"));
});

// ADMIN ACTIVATE/DEACTIVATE USER - Optional Enhancement
const activateOrDeactivateUser = asyncHandler(
  async (req: Request, res: Response) => {
    // only admin can activate/deactivate users
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res
        .status(403)
        .json(
          new ApiError(403, "Forbidden: Only Admin can perform this action.")
        );
    }

    const { userId, isActive } = req.body;
    const user = await db
      .update(users)
      .set({ isActive })
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(500).json(new ApiError(500, "Unable to update user"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, null, "User Status updated successfully!"));
  }
);

export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  updateProfile,
  activateOrDeactivateUser,
};

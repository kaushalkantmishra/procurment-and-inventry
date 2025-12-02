import jwt, { UserJwtPayload } from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request.");
    }

    // decode token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as UserJwtPayload;

    // decoded = { id, email, role, iat, exp }
    if (!decoded?.id) {
      throw new ApiError(400, "Invalid token payload.");
    }

    // Fetch user using Drizzle
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

    if (user.length === 0) {
      throw new ApiError(401, "Invalid access token.");
    }

    req.user = user[0];
    next();
  } catch (error) {
    console.log("JWT Error:", error);

    let message = "Invalid or expired token.";

    if (error instanceof Error) {
      message = error.message;
    }

    throw new ApiError(401, message);
  }
});

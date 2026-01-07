import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/response.util";

interface JWTPayload {
  user_id: string;
  email: string;
  roles: string[];
  user_type: "admin" | "employee";
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized(res, "Access token required");
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return ApiResponse.unauthorized(res, "Access token required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JWTPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return ApiResponse.unauthorized(res, "Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return ApiResponse.unauthorized(res, "Invalid token");
    }
    return ApiResponse.unauthorized(res, "Authentication failed");
  }
};
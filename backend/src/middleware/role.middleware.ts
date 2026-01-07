import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response.util";

export const requireRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Authentication required");
    }

    const userRoles = req.user.roles || [];
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return ApiResponse.error(res, "Insufficient permissions", 403);
    }

    next();
  };
};

export const requireAdmin = requireRoles(["ADMIN"]);
export const requireProcurement = requireRoles(["ADMIN", "PROCUREMENT"]);
export const requireApprover = requireRoles(["ADMIN", "APPROVER"]);
export const requireStore = requireRoles(["ADMIN", "STORE"]);
export const requireFinance = requireRoles(["ADMIN", "FINANCE"]);
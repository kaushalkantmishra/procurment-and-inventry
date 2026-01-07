import { db } from "../../../db/index";
import { tblUsers, tblRoles, tblUserRoles } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

export class UserManagementService {
  async assignRoles(userId: string, roleIds: number[], primaryRoleId?: number) {
    // Remove existing roles
    await db
      .update(tblUserRoles)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblUserRoles.user_id, userId));

    // Assign new roles
    const userRoleData = roleIds.map(roleId => ({
      user_id: userId,
      role_id: roleId,
      is_primary: roleId === primaryRoleId
    }));

    await db.insert(tblUserRoles).values(userRoleData);
    return { success: true, message: "Roles assigned successfully" };
  }

  async getUserRoles(userId: string) {
    return await db
      .select({
        role_id: tblRoles.id,
        role_code: tblRoles.role_code,
        role_name: tblRoles.role_name,
        is_primary: tblUserRoles.is_primary
      })
      .from(tblUserRoles)
      .innerJoin(tblRoles, eq(tblRoles.id, tblUserRoles.role_id))
      .where(and(
        eq(tblUserRoles.user_id, userId),
        eq(tblUserRoles.is_deleted, false),
        eq(tblRoles.is_active, true)
      ));
  }

  async getAllRoles() {
    return await db
      .select()
      .from(tblRoles)
      .where(and(
        eq(tblRoles.is_active, true),
        eq(tblRoles.is_deleted, false)
      ));
  }

  async getAllUsers() {
    return await db
      .select({
        id: tblUsers.id,
        name: tblUsers.name,
        email: tblUsers.email,
        is_active: tblUsers.is_active,
        created_at: tblUsers.created_at
      })
      .from(tblUsers)
      .where(eq(tblUsers.is_deleted, false));
  }
}
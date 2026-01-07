import { db } from "../../../db/index";
import { tblUsers, tblRoles, tblUserRoles } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  async login(credentials: any) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const userWithRoles = await db
      .select({
        id: tblUsers.id,
        name: tblUsers.name,
        email: tblUsers.email,
        password_hash: tblUsers.password_hash,
        is_active: tblUsers.is_active,
        role_code: tblRoles.role_code,
        is_primary: tblUserRoles.is_primary
      })
      .from(tblUsers)
      .leftJoin(tblUserRoles, and(
        eq(tblUserRoles.user_id, tblUsers.id),
        eq(tblUserRoles.is_deleted, false)
      ))
      .leftJoin(tblRoles, and(
        eq(tblRoles.id, tblUserRoles.role_id),
        eq(tblRoles.is_active, true)
      ))
      .where(and(
        eq(tblUsers.email, email),
        eq(tblUsers.is_active, true),
        eq(tblUsers.is_deleted, false)
      ));

    if (!userWithRoles.length) {
      throw new Error("Invalid credentials");
    }

    const user = userWithRoles[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const roles = userWithRoles
      .filter(ur => ur.role_code)
      .map(ur => ur.role_code!);
    
    const user_type = roles.includes("ADMIN") ? "admin" : "employee";

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        roles,
        user_type
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    const { password_hash: _, ...userWithoutPassword } = user;
    return { 
      user: { ...userWithoutPassword, roles, user_type }, 
      token 
    };
  }

  async register(userData: any) {
    const { name, email, password } = userData;

    if (!email || !password || !name) {
      throw new Error("Name, email and password are required");
    }

    const [existingUser] = await db
      .select()
      .from(tblUsers)
      .where(eq(tblUsers.email, email));
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(tblUsers)
      .values({
        name,
        email,
        password_hash: hashedPassword,
      })
      .returning();

    const { password_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async logout() {
    return { success: true, message: "Logout successful" };
  }

  async getCurrentUser(token?: string) {
    if (!token) return null;
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
      
      const userWithRoles = await db
        .select({
          id: tblUsers.id,
          name: tblUsers.name,
          email: tblUsers.email,
          is_active: tblUsers.is_active,
          role_code: tblRoles.role_code
        })
        .from(tblUsers)
        .leftJoin(tblUserRoles, and(
          eq(tblUserRoles.user_id, tblUsers.id),
          eq(tblUserRoles.is_deleted, false)
        ))
        .leftJoin(tblRoles, and(
          eq(tblRoles.id, tblUserRoles.role_id),
          eq(tblRoles.is_active, true)
        ))
        .where(eq(tblUsers.id, decoded.user_id));

      if (!userWithRoles.length) return null;

      const user = userWithRoles[0];
      const roles = userWithRoles
        .filter(ur => ur.role_code)
        .map(ur => ur.role_code!);
      
      const user_type = roles.includes("ADMIN") ? "admin" : "employee";

      return { ...user, roles, user_type };
    } catch {
      return null;
    }
  }
}

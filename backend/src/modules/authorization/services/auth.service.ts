import { db } from "../../../db/index";
import { tblUsers } from "../../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  private currentUser: any = null;

  async login(credentials: any) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const [user] = await db
      .select()
      .from(tblUsers)
      .where(eq(tblUsers.email, email))
      .limit(1);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
    );

    const { password_hash: _, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;

    return { user: userWithoutPassword, token };
  }

  async register(userData: any) {
    const { name, email, password, role, profile } = userData;

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
        role: role || "employee",
        profile,
      })
      .returning();

    const { password_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async logout() {
    this.currentUser = null;
    return { success: true, message: "Logout successful" };
  }

  async getCurrentUser(token?: string) {
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as any;
      const [user] = await db
        .select()
        .from(tblUsers)
        .where(eq(tblUsers.id, decoded.id));
      if (user) {
        const { password_hash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return this.currentUser;
  }
}

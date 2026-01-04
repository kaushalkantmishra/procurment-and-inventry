import { db } from "../../../db/index";
import { tblModules } from "../../../db/schema";
import { eq } from "drizzle-orm";

export class ModuleService {
  async getAllModules() {
    return await db
      .select()
      .from(tblModules)
      .where(eq(tblModules.is_active, true));
  }

  async createModule(moduleData: any) {
    const [newModule] = await db
      .insert(tblModules)
      .values(moduleData)
      .returning();
    return newModule;
  }

  async getModuleById(id: number) {
    const [module] = await db
      .select()
      .from(tblModules)
      .where(eq(tblModules.id, id));
    if (!module) throw new Error("Module not found");
    return module;
  }

  async updateModule(id: number, moduleData: any) {
    const [updatedModule] = await db
      .update(tblModules)
      .set({ ...moduleData, updated_at: new Date() })
      .where(eq(tblModules.id, id))
      .returning();
    if (!updatedModule) throw new Error("Module not found");
    return updatedModule;
  }

  async deleteModule(id: number) {
    const [deletedModule] = await db
      .update(tblModules)
      .set({ is_active: false, updated_at: new Date() })
      .where(eq(tblModules.id, id))
      .returning();
    if (!deletedModule) throw new Error("Module not found");
    return deletedModule;
  }
}

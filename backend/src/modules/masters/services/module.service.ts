import { db } from "../../../db/index";
import { tblModules } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { CreateModuleRequest, UpdateModuleRequest } from '../types';

export class ModuleService {
  async getAllModules() {
    return await db
      .select()
      .from(tblModules)
      .where(and(eq(tblModules.is_active, true), eq(tblModules.is_deleted, false)));
  }

  async createModule(moduleData: CreateModuleRequest) {
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
      .where(and(eq(tblModules.id, id), eq(tblModules.is_deleted, false)));
    if (!module) throw new Error("Module not found");
    return module;
  }

  async updateModule(id: number, moduleData: UpdateModuleRequest) {
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
      .set({ is_deleted: true, deleted_at: new Date(), updated_at: new Date() })
      .where(eq(tblModules.id, id))
      .returning();
    if (!deletedModule) throw new Error("Module not found");
    return deletedModule;
  }
}
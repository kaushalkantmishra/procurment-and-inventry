import { db } from "../../../db/index";
import { tblPurchaseRequests } from '../../../db/procurement.schema';
import { eq, and } from "drizzle-orm";
import { CreatePurchaseRequestRequest, UpdatePurchaseRequestRequest } from '../types';

export class PurchaseRequestService {
  async getAll() {
    return await db
      .select()
      .from(tblPurchaseRequests)
      .where(eq(tblPurchaseRequests.is_deleted, false));
  }

  async getById(id: number) {
    const [pr] = await db
      .select()
      .from(tblPurchaseRequests)
      .where(
        and(
          eq(tblPurchaseRequests.id, id),
          eq(tblPurchaseRequests.is_deleted, false)
        )
      );
    return pr;
  }

  async create(request: CreatePurchaseRequestRequest , userId: string) {
    const {
      requesting_department,
      requester_employee_code,
      required_date,
      justification,
      maintenance_work_order
    } = request;
    
    const [pr] = await db.insert(tblPurchaseRequests).values({
      requesting_department,
      requester_employee_code : userId,
      required_date: required_date ? required_date : null,
      justification,
      maintenance_work_order
    }).returning();
    return pr;
  }

  async update(id: number, request: UpdatePurchaseRequestRequest) {
    const {
      requesting_department,
      requester_employee_code,
      required_date,
      justification,
      maintenance_work_order,
      status
    } = request;
    
    const [pr] = await db
      .update(tblPurchaseRequests)
      .set({ 
        requesting_department,
        requester_employee_code,
        required_date: required_date ? required_date : null,
        justification,
        maintenance_work_order,
        status,
        updated_at: new Date() 
      })
      .where(eq(tblPurchaseRequests.id, id))
      .returning();
    if (!pr) throw new Error("Purchase request not found");
    return pr;
  }

  async delete(id: number) {
    const [pr] = await db
      .update(tblPurchaseRequests)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblPurchaseRequests.id, id))
      .returning();
    if (!pr) throw new Error("Purchase request not found");
    return pr;
  }
}

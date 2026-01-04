import { db } from "../../../db";
import { tblApprovalWorkflows, tblApprovalLevels, tblApprovalInstances, tblApprovalHistory } from "../../../db/masters.schema";
import { tblPurchaseOrders, tblPurchaseRequests, tblVendorInvoices } from "../../../db/procurement.schema";
import { eq, and } from "drizzle-orm";
import { DOCUMENT_TYPES, APPROVAL_ACTIONS, DOCUMENT_STATUS, ERROR_MESSAGES } from "../../../constants";

export class ApprovalWorkflowService {
  async submitForApproval(data: {
    documentType: string;
    documentId: number;
    workflowCode: string;
    submittedBy: string;
  }) {
    const workflow = await db.select().from(tblApprovalWorkflows)
      .where(eq(tblApprovalWorkflows.workflow_code, data.workflowCode)).limit(1);
    
    if (!workflow[0]) throw new Error(ERROR_MESSAGES.WORKFLOW_NOT_FOUND);

    return await db.transaction(async (tx) => {
      const [instance] = await tx.insert(tblApprovalInstances).values({
        workflow_id: workflow[0].id,
        document_type: data.documentType,
        document_id: data.documentId,
        submitted_by: data.submittedBy,
      }).returning();

      // Update document status to PENDING
      await this.updateDocumentStatus(tx, data.documentType, data.documentId, DOCUMENT_STATUS.PENDING);

      return instance;
    });
  }

  async getPendingApprovals(userId: string) {
    return await db.select().from(tblApprovalInstances)
      .where(eq(tblApprovalInstances.overall_status, DOCUMENT_STATUS.PENDING));
  }

  async processApproval(instanceId: number, data: {
    action: string;
    approverId: string;
    comments?: string;
  }) {
    return await db.transaction(async (tx) => {
      const instance = await tx.select().from(tblApprovalInstances)
        .where(eq(tblApprovalInstances.id, instanceId)).limit(1);
      
      if (!instance[0]) throw new Error(ERROR_MESSAGES.APPROVAL_INSTANCE_NOT_FOUND);

      await tx.insert(tblApprovalHistory).values({
        approval_instance_id: instanceId,
        level_sequence: instance[0].current_level || 1,
        approver_id: data.approverId,
        action: data.action,
        comments: data.comments || null,
      });

      const updateData: any = { updated_at: new Date() };
      let documentStatus: string = DOCUMENT_STATUS.PENDING;
      
      if (data.action === APPROVAL_ACTIONS.APPROVED) {
        const nextLevel = (instance[0].current_level || 1) + 1;
        const hasMoreLevels = await this.checkMoreLevels(tx, instance[0].workflow_id, nextLevel);
        
        if (hasMoreLevels) {
          updateData.current_level = nextLevel;
          documentStatus = DOCUMENT_STATUS.PENDING;
        } else {
          updateData.overall_status = DOCUMENT_STATUS.APPROVED;
          updateData.completed_at = new Date();
          documentStatus = DOCUMENT_STATUS.APPROVED;
        }
      } else if (data.action === APPROVAL_ACTIONS.REJECTED) {
        updateData.overall_status = DOCUMENT_STATUS.REJECTED;
        updateData.completed_at = new Date();
        documentStatus = DOCUMENT_STATUS.REJECTED;
      }

      const [updated] = await tx.update(tblApprovalInstances)
        .set(updateData)
        .where(eq(tblApprovalInstances.id, instanceId))
        .returning();

      // Sync document status
      await this.updateDocumentStatus(tx, instance[0].document_type, instance[0].document_id, documentStatus);

      return updated;
    });
  }

  async getWorkflows() {
    return await db.select().from(tblApprovalWorkflows)
      .where(eq(tblApprovalWorkflows.is_deleted, false));
  }

  async createWorkflow(data: any) {
    const [workflow] = await db.insert(tblApprovalWorkflows).values(data).returning();
    return workflow;
  }

  private async checkMoreLevels(tx: any, workflowId: number, nextLevel: number): Promise<boolean> {
    const levels = await tx.select().from(tblApprovalLevels)
      .where(and(
        eq(tblApprovalLevels.workflow_id, workflowId),
        eq(tblApprovalLevels.level_sequence, nextLevel),
        eq(tblApprovalLevels.is_deleted, false)
      ));
    return levels.length > 0;
  }

  private async updateDocumentStatus(tx: any, documentType: string, documentId: number, status: string) {
    switch (documentType) {
      case DOCUMENT_TYPES.PURCHASE_ORDER:
        await tx.update(tblPurchaseOrders)
          .set({ status, updated_at: new Date() })
          .where(eq(tblPurchaseOrders.id, documentId));
        break;
      case DOCUMENT_TYPES.PURCHASE_REQUEST:
        await tx.update(tblPurchaseRequests)
          .set({ status, updated_at: new Date() })
          .where(eq(tblPurchaseRequests.id, documentId));
        break;
      case DOCUMENT_TYPES.INVOICE:
        await tx.update(tblVendorInvoices)
          .set({ payment_status: status, updated_at: new Date() })
          .where(eq(tblVendorInvoices.id, documentId));
        break;
    }
  }
}
import { db } from "../../../db";
import { tblMaterialIssues, tblMaterialIssueLines, tblInventoryTransactions } from "../../../db/inventory.schema";
import { StockBalanceService } from "./stockBalance.service";
import { eq, and } from "drizzle-orm";
import { NUMBER_PREFIXES, ISSUE_STATUS, TRANSACTION_TYPES, ERROR_MESSAGES } from "../../../constants";

export class MaterialIssueService {
  async getAll() {
    return await db.select().from(tblMaterialIssues)
      .where(eq(tblMaterialIssues.is_deleted, false));
  }

  async getById(id: number) {
    const [issue] = await db.select().from(tblMaterialIssues)
      .where(and(eq(tblMaterialIssues.id, id), eq(tblMaterialIssues.is_deleted, false)));
    return issue;
  }

  async create(data: any) {
    const [issue] = await db.insert(tblMaterialIssues).values({
      issue_number: `${NUMBER_PREFIXES.MATERIAL_ISSUE}-${Date.now()}`,
      ...data
    }).returning();

    if (data.lines) {
      await db.insert(tblMaterialIssueLines).values(
        data.lines.map((line: any) => ({
          issue_id: issue.id,
          ...line
        }))
      );
    }

    return issue;
  }

  async issueMaterials(issueId: number, data: any) {
    return await db.transaction(async (tx) => {
      const issue = await this.getById(issueId);
      if (!issue) throw new Error(ERROR_MESSAGES.MATERIAL_ISSUE_NOT_FOUND);

      const stockService = new StockBalanceService();

      // Validate stock availability for all items first
      for (const line of data.lines) {
        const balance = await stockService.getStockBalance(line.itemId, issue.from_warehouse_id);
        if (!balance || (balance.available_quantity !== null && balance.available_quantity < line.issuedQuantity)) {
          throw new Error(`Insufficient stock for item ${line.itemId}. Available: ${balance?.available_quantity || 0}, Required: ${line.issuedQuantity}`);
        }
      }

      // Process all issues
      for (const line of data.lines) {
        await tx.update(tblMaterialIssueLines)
          .set({ issued_quantity: line.issuedQuantity })
          .where(eq(tblMaterialIssueLines.id, line.lineId));

        await stockService.updateStockBalance(
          line.itemId, 
          issue.from_warehouse_id, 
          line.issuedQuantity, 
          'OUT'
        );

        await tx.insert(tblInventoryTransactions).values({
          item_id: line.itemId,
          transaction_type: TRANSACTION_TYPES.ISSUE,
          quantity: -line.issuedQuantity,
          reference: issue.issue_number,
          performed_by: issue.issued_by,
        });
      }

      const [updated] = await tx.update(tblMaterialIssues)
        .set({ status: ISSUE_STATUS.ISSUED, updated_at: new Date() })
        .where(eq(tblMaterialIssues.id, issueId))
        .returning();

      return updated;
    });
  }

  async delete(id: number) {
    const [issue] = await db.update(tblMaterialIssues)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblMaterialIssues.id, id))
      .returning();
    return issue;
  }
}
# New ERP Module APIs

## Approval Workflow APIs

### Submit for Approval
```
POST /api/approvals/submit
Body: {
  "documentType": "PO",
  "documentId": 123,
  "workflowCode": "PO_APPROVAL",
  "submittedBy": "user-uuid"
}
Response: {
  "success": true,
  "data": { "id": 456, "overall_status": "PENDING" }
}
```

### Get Pending Approvals
```
GET /api/approvals/pending?userId={userId}
Response: {
  "success": true,
  "data": [
    {
      "id": 456,
      "document_type": "PO",
      "document_id": 123,
      "current_level": 1,
      "submitted_by": "user-uuid"
    }
  ]
}
```

### Process Approval
```
POST /api/approvals/{instanceId}/action
Body: {
  "action": "APPROVED",
  "approverId": "user-uuid",
  "comments": "Approved with conditions"
}
Response: {
  "success": true,
  "data": { "current_level": 2, "overall_status": "PENDING" }
}
```

## Vendor Invoice APIs

### Create Invoice
```
POST /api/vendor-invoices
Body: {
  "vendor_invoice_number": "INV-001",
  "vendor_id": "VEN001",
  "po_id": 123,
  "invoice_date": "2024-01-01",
  "total_amount": "5000.00",
  "lines": [
    {
      "po_line_id": 456,
      "item_id": 789,
      "quantity": 10,
      "unit_price": "500.00",
      "line_total": "5000.00"
    }
  ]
}
```

### 3-Way Match
```
POST /api/vendor-invoices/{invoiceId}/match
Response: {
  "success": true,
  "data": [
    {
      "match_status": "VARIANCE",
      "quantity_variance": 0,
      "price_variance": "20.00"
    }
  ]
}
```

## Stock Balance APIs

### Get Stock Balance
```
GET /api/system/stock-balances?itemId=123&warehouseId=1
Response: {
  "success": true,
  "data": {
    "available_quantity": 100,
    "reserved_quantity": 20,
    "on_order_quantity": 50
  }
}
```

### Sync Stock Balances
```
POST /api/system/stock-balances/sync
Body: { "warehouseId": 1 }
Response: {
  "success": true,
  "data": { "message": "Stock balances synchronized" }
}
```

## Material Issue APIs

### Create Material Issue
```
POST /api/system/material-issues
Body: {
  "issue_type": "CONSUMPTION",
  "from_warehouse_id": 1,
  "department": "Production",
  "requested_by": "user-uuid",
  "lines": [
    {
      "item_id": 123,
      "requested_quantity": 10
    }
  ]
}
```

### Issue Materials
```
POST /api/system/material-issues/{issueId}/issue
Body: {
  "lines": [
    {
      "lineId": 456,
      "itemId": 123,
      "issuedQuantity": 8
    }
  ]
}
```

## Document Attachment APIs

### Upload Attachment
```
POST /api/system/attachments/upload
Content-Type: multipart/form-data
Body: {
  "file": [binary],
  "documentType": "PO",
  "documentId": "123",
  "uploadedBy": "user-uuid"
}
Response: {
  "success": true,
  "data": {
    "id": 1,
    "file_name": "PO_123_1640995200000",
    "file_path": "https://res.cloudinary.com/your-cloud/image/upload/v1640995200/erp/po/PO_123_1640995200000.pdf",
    "file_size": 1024
  }
}
```

### Delete Attachment
```
DELETE /api/system/attachments/{id}
Response: {
  "success": true,
  "message": "Attachment deleted successfully"
}
```

### Get Attachments
```
GET /api/system/attachments?documentType=PO&documentId=123
Response: {
  "success": true,
  "data": [
    {
      "id": 1,
      "file_name": "po_terms.pdf",
      "original_name": "Purchase Order Terms.pdf",
      "file_size": 1024,
      "uploaded_by": "user-uuid"
    }
  ]
}
```

## Business Rules

### Approval Workflow
- Documents must be submitted through workflow before approval
- Approval levels are sequential and amount-based
- Rejection stops workflow and reverts document status
- All approvals are logged in audit trail

### Stock Balance Updates
- Updated automatically on GRN receipt (+)
- Updated on material issue (-)
- Updated on PO creation (reserved +)
- Sync function recalculates from transaction history

### 3-Way Matching
- Compares PO, GRN, and Invoice quantities/prices
- Calculates variances automatically
- Invoice payment blocked until successful match
- Variance tolerance configurable per organization

### Material Issues
- Stock availability checked before issue
- Inventory transactions created automatically
- Stock balances updated in real-time
- Transfer between warehouses creates dual entries

## Database Schema Changes

### New Tables Added:
- `tbl_approval_workflows` - Workflow definitions
- `tbl_approval_levels` - Approval hierarchy
- `tbl_approval_instances` - Document approval tracking
- `tbl_approval_history` - Approval audit trail
- `tbl_vendor_invoices` - Vendor invoice headers
- `tbl_invoice_lines` - Invoice line details
- `tbl_three_way_matching` - Matching results
- `tbl_stock_balances` - Real-time stock levels
- `tbl_material_issues` - Material issue headers
- `tbl_material_issue_lines` - Issue line details
- `tbl_document_attachments` - File attachments
- `tbl_system_enums` - System-wide enumerations
- `tbl_audit_logs` - Complete audit trail

### Installation Steps:
1. Set Cloudinary environment variables in `.env`:
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key` 
   - `CLOUDINARY_API_SECRET=your_api_secret`
2. Run `npx drizzle-kit generate` to create migrations
3. Run `npx drizzle-kit push` to apply to database
4. Run `npm run seed:new` to populate initial data
5. Restart backend server to load new routes

### File Upload Features:
- **Cloudinary Integration** - Files stored in cloud with CDN
- **File Type Validation** - PDF, Word, Excel, Images, Text files
- **Size Limit** - 10MB maximum file size
- **Organized Storage** - Files organized by document type in folders
- **Automatic Cleanup** - Temporary files removed after upload
- **Secure URLs** - Direct Cloudinary URLs for file access
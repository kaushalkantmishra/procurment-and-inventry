# Procurement Module Documentation

## Overview
The Procurement module is a comprehensive system for managing the complete procurement lifecycle from purchase requests to vendor invoice processing and three-way matching.

## 🏗️ Architecture

### Database Schema
- **tbl_purchase_requests** - Purchase requisitions from departments
- **tbl_purchase_orders** - Purchase orders with supplier details
- **tbl_po_lines** - Line items for purchase orders
- **tbl_po_distributions** - Distribution details for PO lines
- **tbl_grn_headers** - Goods Receipt Note headers
- **tbl_grn_details** - GRN line items with quantity tracking
- **tbl_vendor_invoices** - Vendor invoice headers
- **tbl_invoice_lines** - Invoice line items
- **tbl_three_way_matching** - Three-way matching records

### Service Layer
- **PurchaseRequestService** - PR CRUD operations
- **PurchaseOrderService** - PO management with approval workflow
- **GrnHeaderService** - GRN header operations
- **GrnDetailService** - GRN detail management
- **VendorInvoiceService** - Invoice processing
- **ThreeWayMatchingService** - Automated matching logic
- **ProcurementDashboardService** - Analytics and metrics

## 🔄 Procurement Workflow

### 1. Purchase Request (PR)
- **Create**: Department creates purchase request
- **Status**: Saved → Submitted → Approved/Rejected
- **Fields**: Item, quantity, estimated cost, justification

### 2. Purchase Order (PO)
- **Create**: Convert approved PR to PO or create directly
- **Approval Workflow**:
  - Draft → Pending → Approved/Rejected
  - `submitForApproval()` - Submit PO for approval
  - `approve()` - Approve PO
  - `reject()` - Reject with reason
- **Line Items**: Multiple items per PO with quantities and prices
- **Distributions**: Ship-to locations and account codes

### 3. Goods Receipt Note (GRN)
- **Receipt**: Record incoming goods against PO
- **Quality Control**: Track ordered vs received vs accepted quantities
- **Inspection**: QAD checks and condition notes
- **Storage**: Assign storage locations

### 4. Vendor Invoice Processing
- **Invoice Entry**: Vendor invoice details
- **Matching**: Link to PO and GRN
- **Status Tracking**: Payment and match status

### 5. Three-Way Matching
- **Automatic Matching**: Compare PO, GRN, and Invoice
- **Variance Detection**: Quantity and price variances
- **Match Status**: MATCHED, VARIANCE, UNMATCHED
- **Approval**: Manual review for variances

## 📊 Dashboard & Analytics

### Key Metrics
- **Purchase Requests**: Total count, pending approvals
- **Purchase Orders**: Total count, open orders, total value
- **GRNs**: Total count, pending inspections
- **Invoices**: Total count, unmatched invoices

### Real-time Data
- Live procurement pipeline status
- Variance tracking and alerts
- Approval bottlenecks identification

## 🔐 Current Features

### ✅ Implemented
- **CRUD Operations**: All entities with soft delete
- **Purchase Request Management**: Create, update, track status
- **Purchase Order Workflow**: 
  - Multi-line PO creation
  - Basic approval workflow (submit/approve/reject)
  - Status management
- **GRN Processing**: 
  - Receipt recording
  - Quantity variance tracking
  - Quality inspection workflow
- **Invoice Management**: Vendor invoice entry and tracking
- **Three-Way Matching**: 
  - Automatic variance calculation
  - Match status determination
  - System-generated matching records
- **Dashboard Analytics**: Real-time procurement metrics
- **API Endpoints**: RESTful APIs for all operations

### 🚧 Approval Workflow Status
**Current Implementation**: Basic approval workflow
- PO status transitions: Draft → Pending → Approved/Rejected
- Simple approve/reject methods
- Status-based filtering

**Missing Advanced Features**:
- Multi-level approval hierarchy
- Role-based approval limits
- Approval delegation
- Email notifications
- Approval history tracking
- Conditional approval rules

## 🛠️ API Endpoints

### Purchase Requests
- `GET /api/procurement/purchase-requests` - List all PRs
- `POST /api/procurement/purchase-requests` - Create PR
- `GET /api/procurement/purchase-requests/:id` - Get PR by ID
- `PUT /api/procurement/purchase-requests/:id` - Update PR
- `DELETE /api/procurement/purchase-requests/:id` - Soft delete PR

### Purchase Orders
- `GET /api/procurement/purchase-orders` - List all POs
- `POST /api/procurement/purchase-orders` - Create PO with lines
- `GET /api/procurement/purchase-orders/:id` - Get PO by ID
- `PUT /api/procurement/purchase-orders/:id` - Update PO
- `POST /api/procurement/purchase-orders/:id/submit` - Submit for approval
- `POST /api/procurement/purchase-orders/:id/approve` - Approve PO
- `POST /api/procurement/purchase-orders/:id/reject` - Reject PO
- `DELETE /api/procurement/purchase-orders/:id` - Soft delete PO

### GRN Management
- `GET /api/procurement/grn-headers` - List GRN headers
- `POST /api/procurement/grn-headers` - Create GRN
- `GET /api/procurement/grn-details` - List GRN details
- `POST /api/procurement/grn-details` - Create GRN detail

### Three-Way Matching
- `GET /api/procurement/three-way-matching` - List matches
- `POST /api/procurement/three-way-matching/auto-match` - Auto-match documents
- `PUT /api/procurement/three-way-matching/:id` - Update match

### Dashboard
- `GET /api/procurement/dashboard` - Get procurement metrics

## 🔮 Future Enhancements

### Advanced Approval Workflow
- **Multi-level Approvals**: Department → Manager → Finance → Procurement
- **Approval Limits**: Amount-based approval routing
- **Delegation**: Temporary approval delegation
- **Notifications**: Email/SMS alerts for pending approvals
- **Audit Trail**: Complete approval history

### Enhanced Matching
- **Tolerance Settings**: Configurable variance thresholds
- **Exception Handling**: Automated exception routing
- **Bulk Matching**: Process multiple documents
- **Machine Learning**: Pattern recognition for auto-approval

### Integration Features
- **Supplier Portal**: Direct supplier integration
- **Budget Integration**: Real-time budget checking
- **Inventory Integration**: Automatic stock updates
- **Finance Integration**: GL posting and accruals

### Reporting & Analytics
- **Procurement Analytics**: Spend analysis, supplier performance
- **Compliance Reports**: Audit trails, policy adherence
- **Performance Metrics**: Cycle times, approval bottlenecks
- **Forecasting**: Demand planning and budget forecasting

## 🔧 Technical Implementation

### Service Pattern
```typescript
// Example: Purchase Order Service
class PurchaseOrderService {
  async create(data) { /* Create PO with lines */ }
  async submitForApproval(id, user) { /* Workflow transition */ }
  async approve(id, approver) { /* Approval logic */ }
}
```

### Controller Pattern
```typescript
// RESTful API controllers
class PurchaseOrderController {
  static async create(req, res) { /* Handle HTTP request */ }
  static async submitForApproval(req, res) { /* Approval endpoint */ }
}
```

### Database Relations
- **One-to-Many**: PO → PO Lines, GRN → GRN Details
- **Many-to-One**: PO Lines → Items, GRN → PO
- **Reference Integrity**: Foreign key constraints
- **Soft Deletes**: Audit trail preservation

## 📋 Development Guidelines

### Adding New Features
1. **Schema Changes**: Update procurement.schema.ts
2. **Service Layer**: Implement business logic
3. **Controller Layer**: Add HTTP endpoints
4. **Route Registration**: Update route files
5. **Testing**: Unit and integration tests

### Best Practices
- **Soft Deletes**: Never hard delete procurement records
- **Audit Trail**: Track all status changes
- **Validation**: Input validation at service layer
- **Error Handling**: Consistent error responses
- **Transaction Safety**: Use database transactions for multi-table operations
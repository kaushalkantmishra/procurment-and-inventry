export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  vendorId: string;
  date: string;
  expectedDelivery: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: "draft" | "pending" | "approved" | "received" | "cancelled";
  createdBy: string;
}

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO001",
    poNumber: "PO-2024-001",
    vendor: "Global Supply Co.",
    vendorId: "V001",
    date: "2024-11-01",
    expectedDelivery: "2024-11-15",
    items: [
      {
        productId: "P001",
        productName: "Laptop Computer",
        quantity: 10,
        unitPrice: 899.99,
        total: 8999.9,
      },
      {
        productId: "P010",
        productName: 'LED Monitor 24"',
        quantity: 15,
        unitPrice: 179.99,
        total: 2699.85,
      },
    ],
    subtotal: 11699.75,
    tax: 1169.98,
    totalAmount: 12869.73,
    status: "received",
    createdBy: "Admin User",
  },
  {
    id: "PO002",
    poNumber: "PO-2024-002",
    vendor: "Office Essentials Inc.",
    vendorId: "V003",
    date: "2024-11-05",
    expectedDelivery: "2024-11-20",
    items: [
      {
        productId: "P002",
        productName: "Office Desk",
        quantity: 20,
        unitPrice: 299.99,
        total: 5999.8,
      },
      {
        productId: "P011",
        productName: "Ergonomic Chair",
        quantity: 20,
        unitPrice: 249.99,
        total: 4999.8,
      },
    ],
    subtotal: 10999.6,
    tax: 1099.96,
    totalAmount: 12099.56,
    status: "approved",
    createdBy: "Admin User",
  },
  {
    id: "PO003",
    poNumber: "PO-2024-003",
    vendor: "Tech Hardware Ltd.",
    vendorId: "V002",
    date: "2024-11-10",
    expectedDelivery: "2024-11-25",
    items: [
      {
        productId: "P003",
        productName: "Printer Ink Cartridge",
        quantity: 50,
        unitPrice: 45.99,
        total: 2299.5,
      },
    ],
    subtotal: 2299.5,
    tax: 229.95,
    totalAmount: 2529.45,
    status: "pending",
    createdBy: "Admin User",
  },
  {
    id: "PO004",
    poNumber: "PO-2024-004",
    vendor: "Industrial Parts Group",
    vendorId: "V004",
    date: "2024-11-12",
    expectedDelivery: "2024-11-28",
    items: [
      {
        productId: "P004",
        productName: "Safety Helmet",
        quantity: 100,
        unitPrice: 25.5,
        total: 2550.0,
      },
      {
        productId: "P014",
        productName: "Safety Goggles",
        quantity: 100,
        unitPrice: 12.99,
        total: 1299.0,
      },
      {
        productId: "P022",
        productName: "Protective Gloves",
        quantity: 200,
        unitPrice: 5.99,
        total: 1198.0,
      },
    ],
    subtotal: 5047.0,
    tax: 504.7,
    totalAmount: 5551.7,
    status: "approved",
    createdBy: "Admin User",
  },
  {
    id: "PO005",
    poNumber: "PO-2024-005",
    vendor: "Premium Tools & Equipment",
    vendorId: "V008",
    date: "2024-11-15",
    expectedDelivery: "2024-12-01",
    items: [
      {
        productId: "P007",
        productName: "Industrial Drill",
        quantity: 5,
        unitPrice: 189.99,
        total: 949.95,
      },
      {
        productId: "P016",
        productName: "Power Drill Bits",
        quantity: 10,
        unitPrice: 24.99,
        total: 249.9,
      },
    ],
    subtotal: 1199.85,
    tax: 119.99,
    totalAmount: 1319.84,
    status: "pending",
    createdBy: "Admin User",
  },
  {
    id: "PO006",
    poNumber: "PO-2024-006",
    vendor: "Green Packaging Solutions",
    vendorId: "V005",
    date: "2024-11-18",
    expectedDelivery: "2024-12-05",
    items: [
      {
        productId: "P009",
        productName: "Cardboard Boxes (Large)",
        quantity: 1000,
        unitPrice: 1.25,
        total: 1250.0,
      },
      {
        productId: "P018",
        productName: "Bubble Wrap Roll",
        quantity: 50,
        unitPrice: 18.99,
        total: 949.5,
      },
    ],
    subtotal: 2199.5,
    tax: 219.95,
    totalAmount: 2419.45,
    status: "draft",
    createdBy: "Admin User",
  },
  {
    id: "PO007",
    poNumber: "PO-2024-007",
    vendor: "Smart Tech Distributors",
    vendorId: "V009",
    date: "2024-11-20",
    expectedDelivery: "2024-12-08",
    items: [
      {
        productId: "P005",
        productName: "Wireless Mouse",
        quantity: 30,
        unitPrice: 29.99,
        total: 899.7,
      },
      {
        productId: "P012",
        productName: "USB Flash Drive 64GB",
        quantity: 50,
        unitPrice: 15.99,
        total: 799.5,
      },
    ],
    subtotal: 1699.2,
    tax: 169.92,
    totalAmount: 1869.12,
    status: "pending",
    createdBy: "Admin User",
  },
  {
    id: "PO008",
    poNumber: "PO-2024-008",
    vendor: "Quality Materials Corp.",
    vendorId: "V006",
    date: "2024-11-22",
    expectedDelivery: "2024-12-10",
    items: [
      {
        productId: "P013",
        productName: "Steel Pipes (2m)",
        quantity: 50,
        unitPrice: 45.0,
        total: 2250.0,
      },
      {
        productId: "P024",
        productName: "Aluminum Sheets",
        quantity: 30,
        unitPrice: 68.5,
        total: 2055.0,
      },
    ],
    subtotal: 4305.0,
    tax: 430.5,
    totalAmount: 4735.5,
    status: "approved",
    createdBy: "Admin User",
  },
  {
    id: "PO009",
    poNumber: "PO-2024-009",
    vendor: "Reliable Chemical Supplies",
    vendorId: "V010",
    date: "2024-11-23",
    expectedDelivery: "2024-12-12",
    items: [
      {
        productId: "P008",
        productName: "Chemical Sanitizer",
        quantity: 30,
        unitPrice: 32.5,
        total: 975.0,
      },
      {
        productId: "P017",
        productName: "Cleaning Solution",
        quantity: 50,
        unitPrice: 9.99,
        total: 499.5,
      },
    ],
    subtotal: 1474.5,
    tax: 147.45,
    totalAmount: 1621.95,
    status: "pending",
    createdBy: "Admin User",
  },
  {
    id: "PO010",
    poNumber: "PO-2024-010",
    vendor: "Office Essentials Inc.",
    vendorId: "V003",
    date: "2024-11-24",
    expectedDelivery: "2024-12-15",
    items: [
      {
        productId: "P006",
        productName: "A4 Paper Ream",
        quantity: 100,
        unitPrice: 7.99,
        total: 799.0,
      },
      {
        productId: "P015",
        productName: "Whiteboard Marker Set",
        quantity: 40,
        unitPrice: 8.5,
        total: 340.0,
      },
    ],
    subtotal: 1139.0,
    tax: 113.9,
    totalAmount: 1252.9,
    status: "draft",
    createdBy: "Admin User",
  },
];

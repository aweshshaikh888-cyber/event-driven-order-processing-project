export type Language = "en" | "mr";

export type UserRole = "customer" | "owner";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role: UserRole;
  createdAt: string;
  address?: string;
  country?: string;
}

export interface Product {
  id: string;
  name: string;
  nameMr: string;
  code: string;
  category: "kraft" | "packaging" | "industrial" | "recycled" | "rolls" | "specialty" | "finished_plates";
  description: string;
  descriptionMr: string;
  material: string;
  gsm: string;
  size: string;
  rollSheetType: "Roll" | "Sheet" | "Pre-cut Blank";
  moq: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  specs: Record<string, string>;
  featured?: boolean;
}

export interface EarningsRow {
  period: string;
  periodMr: string;
  workDays?: number;
  productionKg: string | number;
  incomeInr: string | number;
}

export interface Machine {
  id: string;
  name: string;
  nameMr: string;
  productCode: string;
  category: "paper_machinery" | "drone_machinery" | "industrial_equipment";
  headlineMr?: string;
  headlineEn?: string;
  description: string;
  descriptionMr: string;
  workingProcessMr?: string;
  price: number | null; // null if quote only
  isQuotationOnly: boolean;
  images: string[];
  specs: Record<string, string>;
  specsMr?: Record<string, string>;
  dimensions?: string;
  weight?: string;
  productionCapacity?: string;
  powerRequirement?: string;
  automationLevel?: string;
  materialCompatibility?: string;
  warranty?: string;
  availability?: string;
  features: string[];
  featuresMr: string[];
  applications: string[];
  applicationsMr: string[];
  installationRequirements?: string;
  installationRequirementsMr?: string;
  safetyInfo?: string;
  safetyInfoMr?: string;
  earningsChart?: EarningsRow[];
  earningsNoteMr?: string;
  importantNoteMr?: string;
  brochureUrl?: string;
  manualUrl?: string;
  featured?: boolean;
  status: "active" | "maintenance" | "discontinued";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuoteCartItem {
  id: string;
  itemType: "machine" | "product";
  itemId: string;
  name: string;
  category: string;
  image?: string;
  quantity: number;
  requirements: string;
  expectedDelivery: string;
  notes?: string;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Manufacturing"
  | "Ready for Shipment"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  paymentStatus: "Pending" | "Paid" | "Partial";
  status: OrderStatus;
  shippingAddress: string;
}

export type QuoteStatus =
  | "Pending"
  | "Under Review"
  | "Quotation Sent"
  | "Accepted"
  | "Rejected";

export interface QuoteRequest {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
  items: QuoteCartItem[];
  estimatedPrice: number | null;
  status: QuoteStatus;
  createdAt: string;
  notes?: string;
  deliveryLeadTime?: string;
  ownerReply?: string;
  quotePdfUrl?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  requirementType: string;
  productOrMachine: string;
  quantity: string;
  message: string;
  documentUrl?: string;
  status: "New" | "In Progress" | "Replied";
  reply?: string;
  createdAt: string;
}

export interface TechnicalPaper {
  id: string;
  title: string;
  titleMr: string;
  documentType:
    | "Technical Datasheet"
    | "Machine Manual"
    | "Brochure"
    | "Research Paper"
    | "Installation Guide"
    | "Maintenance Manual"
    | "Product Catalogue";
  category: "paper_machines" | "paper_products" | "drone_equipment" | "automation";
  relatedEntity: string;
  version: string;
  publishedDate: string;
  fileSize: string;
  downloadUrl: string;
  description: string;
  descriptionMr?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: "customer" | "owner" | "all";
  title: string;
  titleMr?: string;
  message: string;
  messageMr?: string;
  date: string;
  read: boolean;
  type: "order" | "quote" | "inventory" | "system";
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  availableQuantity: number;
  reservedQuantity: number;
  unit: string;
  lowStockThreshold: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

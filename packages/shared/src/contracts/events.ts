export enum KafkaTopics {
  ORDER_EVENTS = 'order.events',
  INVENTORY_EVENTS = 'inventory.events',
  PAYMENT_EVENTS = 'payment.events',
  NOTIFICATION_EVENTS = 'notification.events',
  DEAD_LETTER_QUEUE = 'order-processing.dlq'
}

export enum EventType {
  ORDER_CREATED = 'order.created',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_CANCELLED = 'order.cancelled',

  INVENTORY_RESERVED = 'inventory.reserved',
  INVENTORY_FAILED = 'inventory.failed',
  INVENTORY_RELEASED = 'inventory.released',

  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded'
}

export interface BaseEvent<T = any> {
  id: string; // Unique Event ID for Idempotency
  type: EventType;
  aggregateId: string; // Order ID
  timestamp: string; // ISO 8601 string
  version: number;
  data: T;
  metadata?: {
    traceId?: string;
    spanId?: string;
    correlationId?: string;
    retryCount?: number;
    source?: string;
  };
}

export interface OrderItem {
  itemId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderCreatedData {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface InventoryReservedData {
  orderId: string;
  reservationId: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface InventoryFailedData {
  orderId: string;
  reason: string;
  items: OrderItem[];
}

export interface InventoryReleasedData {
  orderId: string;
  reservationId?: string;
  items: OrderItem[];
  reason: string;
}

export interface PaymentCompletedData {
  orderId: string;
  paymentId: string;
  amount: number;
  paymentMethod: string;
}

export interface PaymentFailedData {
  orderId: string;
  reason: string;
  amount: number;
  items: OrderItem[];
}

export interface PaymentRefundedData {
  orderId: string;
  paymentId: string;
  refundAmount: number;
  reason: string;
}

export interface OrderConfirmedData {
  orderId: string;
  paymentId: string;
  reservationId: string;
  totalAmount: number;
}

export interface OrderCancelledData {
  orderId: string;
  reason: string;
  failedStep: string;
  compensated: boolean;
}

// Event types definitions
export type OrderCreatedEvent = BaseEvent<OrderCreatedData>;
export type InventoryReservedEvent = BaseEvent<InventoryReservedData>;
export type InventoryFailedEvent = BaseEvent<InventoryFailedData>;
export type InventoryReleasedEvent = BaseEvent<InventoryReleasedData>;
export type PaymentCompletedEvent = BaseEvent<PaymentCompletedData>;
export type PaymentFailedEvent = BaseEvent<PaymentFailedData>;
export type PaymentRefundedEvent = BaseEvent<PaymentRefundedData>;
export type OrderConfirmedEvent = BaseEvent<OrderConfirmedData>;
export type OrderCancelledEvent = BaseEvent<OrderCancelledData>;

export type DomainEvent =
  | OrderCreatedEvent
  | InventoryReservedEvent
  | InventoryFailedEvent
  | InventoryReleasedEvent
  | PaymentCompletedEvent
  | PaymentFailedEvent
  | PaymentRefundedEvent
  | OrderConfirmedEvent
  | OrderCancelledEvent;

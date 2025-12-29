import { EventEmitter } from 'events';

// Event type definitions
export interface BaseEvent {
  type: string;
  timestamp: Date;
  source: string;
  data: any;
}

export interface ProcurementEvent extends BaseEvent {
  source: 'PROCUREMENT';
  type: 'PO_CREATED' | 'PO_APPROVED' | 'PO_CANCELLED';
}

export interface InventoryEvent extends BaseEvent {
  source: 'INVENTORY';
  type: 'ITEM_CREATED' | 'STOCK_UPDATED' | 'GRN_RECEIVED' | 'RECEIPT_PROCESSED';
}

export interface MasterEvent extends BaseEvent {
  source: 'MASTERS';
  type: 'CATEGORY_CREATED' | 'VENDOR_UPDATED' | 'WAREHOUSE_CREATED';
}

export type ERPEvent = ProcurementEvent | InventoryEvent | MasterEvent;

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(100); // Allow many listeners
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // Emit typed events
  emitEvent(event: ERPEvent): void {
    this.emit(event.type, event);
    this.emit('*', event); // Global listener
  }

  // Subscribe to specific event types
  onEvent(eventType: string, handler: (event: ERPEvent) => void): void {
    this.on(eventType, handler);
  }

  // Subscribe to all events
  onAnyEvent(handler: (event: ERPEvent) => void): void {
    this.on('*', handler);
  }

  // Remove listeners
  offEvent(eventType: string, handler: (event: ERPEvent) => void): void {
    this.off(eventType, handler);
  }
}

export const eventBus = EventBus.getInstance();
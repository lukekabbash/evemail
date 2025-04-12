// Authentication types
export interface AuthState {
  isAuthenticated: boolean;
  characterId: string | null;
  characterName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  scopes: string[];
}

// EVE Online Item types
export interface EveItem {
  typeId: number;
  name: string;
  description: string;
  groupId: number;
  categoryId: number;
  icon?: string;
}

export interface ItemGroup {
  groupId: number;
  name: string;
  categoryId: number;
}

export interface ItemCategory {
  categoryId: number;
  name: string;
}

// Market types
export interface MarketOrder {
  orderId: number;
  typeId: number;
  locationId: number;
  volumeRemain: number;
  price: number;
  isBuyOrder: boolean;
  issued: string;
  range: string;
  minVolume: number;
}

export interface ESIMarketOrder {
  order_id: number;
  type_id: number;
  location_id: number;
  volume_total: number;
  volume_remain: number;
  min_volume: number;
  price: number;
  is_buy_order: boolean;
  duration: number;
  issued: string;
  range: string;
  system_id: number;
}

// Helper function to convert ESI market order to internal format
export const convertESIOrder = (order: ESIMarketOrder): MarketOrder => ({
  orderId: order.order_id,
  typeId: order.type_id,
  locationId: order.location_id,
  volumeRemain: order.volume_remain,
  price: order.price,
  isBuyOrder: order.is_buy_order,
  issued: order.issued,
  range: order.range,
  minVolume: order.min_volume,
});

// Checklist types
export interface ChecklistItem {
  itemId: number;
  name: string;
  quantity: number;
  icon?: string;
}

// Mail types
export interface MailRecipient {
  recipientId: number;
  recipientType: 'character' | 'corporation' | 'alliance' | 'mailing_list';
}

export interface Mail {
  mailId?: number;
  subject: string;
  body: string;
  recipients: MailRecipient[];
  senderId?: number;
  timestamp?: string;
}

// Region types
export interface Region {
  regionId: number;
  name: string;
}

// ESI API response types
export interface ESIResponse<T> {
  data: T;
  headers: {
    [key: string]: string;
  };
  status: number;
}

// Error type
export interface ApiError {
  message: string;
  status?: number;
  details?: string;
} 
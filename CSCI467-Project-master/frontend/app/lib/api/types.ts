export type UserRole = 'ADMIN' | 'WAREHOUSE_WORKER' | 'RECEIVING_DESK';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  pictureURL: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  weight: number;
  pictureURL: string;
  quantity: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  weight?: number;
  pictureURL?: string;
}

export type OrderStatus = 'ORDERED' | 'PACKING' | 'SHIPPED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceAtTime: number;
  weightAtTime: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  cardLast4: string;
  ccAuthNumber: string;
  ccTransactionId: string;
  subtotal: number;
  shippingCost: number;
  totalWeight: number;
  totalAmount: number;
  orderedAt: string;
  packingStartedAt?: string;
  shippedAt?: string;
  cancelledAt?: string;
  items: OrderItem[];
  packedById?: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry?: string;
  creditCard: string;
  creditCardName: string;
  creditCardExpiry: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface OrderFilters {
  startDate?: string;
  endDate?: string;
  status?: OrderStatus;
  minPrice?: number;
  maxPrice?: number;
  orderId?: string;
  customerEmail?: string;
  customerName?: string;
}

export interface ShippingBracket {
  id: string;
  minWeight: number;
  maxWeight: number;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingBracketRequest {
  minWeight: number;
  maxWeight: number;
  cost: number;
}

export interface InventoryLog {
  id: string;
  productId: string;
  userId: string;
  quantityChange: number;
  quantityAfter: number;
  reason: string;
  orderId?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export interface AddInventoryRequest {
  productId: string;
  quantity: number;
}

export interface ApiError {
  error: string;
  insufficientProducts?: Array<{
    productId: string;
    requested: number;
    available: number;
  }>;
}

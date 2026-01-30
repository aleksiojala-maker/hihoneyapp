export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  hours?: string;
  phone?: string;
  image?: string;
}

export type Category = 'Veil' | 'Dress' | 'Accessory' | 'Other';

export interface Product {
  id: string;
  title: string;
  category: Category;
  storeId: string;
  pricePerDay: number;
  imageUrl: string;
  description: string;
  features: string[];
  collection?: string;
  buyPrice?: number;
}

export type RentalStatus = 'reserved' | 'active' | 'completed' | 'late';
export type PaymentStatus = 'paid' | 'pending';

export interface Rental {
  id: string;
  userId: string;
  productId: string;
  storeId: string;
  startDate: string; // ISO Date String
  endDate: string; // ISO Date String
  status: RentalStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface CartItem {
  id: string; // Unique ID for the cart item (e.g. timestamp)
  product: Product;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  totalPrice: number;
}
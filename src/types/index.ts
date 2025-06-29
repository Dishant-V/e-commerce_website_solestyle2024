export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  stylePreference?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
  originalPrice: number;
  priceDropNotified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}
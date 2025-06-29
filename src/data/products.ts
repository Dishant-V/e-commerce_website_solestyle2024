import { Product, Category } from '../types';
import { getAllProducts } from '../utils/database';

export const categories: Category[] = [
  {
    id: 'luxurious',
    name: 'Luxurious',
    subcategories: [
      { id: 'luxury-formal', name: 'Formal Shoes', categoryId: 'luxurious' },
      { id: 'luxury-boots', name: 'Premium Boots', categoryId: 'luxurious' },
      { id: 'luxury-loafers', name: 'Designer Loafers', categoryId: 'luxurious' },
      { id: 'luxury-heels', name: 'Elegant Heels', categoryId: 'luxurious' }
    ]
  },
  {
    id: 'classy',
    name: 'Classy',
    subcategories: [
      { id: 'classy-oxford', name: 'Oxford Shoes', categoryId: 'classy' },
      { id: 'classy-flats', name: 'Classic Flats', categoryId: 'classy' },
      { id: 'classy-boots', name: 'Ankle Boots', categoryId: 'classy' },
      { id: 'classy-loafers', name: 'Penny Loafers', categoryId: 'classy' }
    ]
  },
  {
    id: 'funky',
    name: 'Funky',
    subcategories: [
      { id: 'funky-sneakers', name: 'Bold Sneakers', categoryId: 'funky' },
      { id: 'funky-boots', name: 'Statement Boots', categoryId: 'funky' },
      { id: 'funky-sandals', name: 'Unique Sandals', categoryId: 'funky' },
      { id: 'funky-platforms', name: 'Platform Shoes', categoryId: 'funky' }
    ]
  }
];

// Export products from database
export const products: Product[] = getAllProducts();
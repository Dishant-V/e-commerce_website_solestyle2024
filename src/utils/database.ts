import { Product } from '../types';
import databaseData from '../data/database.json';

// In-memory database that syncs with localStorage
class DatabaseManager {
  private products: Product[] = [];
  private heroProducts: string[] = [];
  private lastUpdated: string = '';

  constructor() {
    this.loadDatabase();
  }

  // Load database from localStorage or fallback to JSON file
  private loadDatabase() {
    try {
      const savedData = localStorage.getItem('solestyle_database');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        this.products = parsed.products || [];
        this.heroProducts = parsed.heroProducts || [];
        this.lastUpdated = parsed.lastUpdated || new Date().toISOString();
      } else {
        // Load from JSON file as fallback - create new array copies to avoid Vite HMR conflicts
        this.products = [...databaseData.products] as Product[];
        this.heroProducts = [...databaseData.heroProducts];
        this.lastUpdated = databaseData.lastUpdated;
        this.saveDatabase();
      }
    } catch (error) {
      console.error('Error loading database:', error);
      // Fallback to JSON data - create new array copies to avoid Vite HMR conflicts
      this.products = [...databaseData.products] as Product[];
      this.heroProducts = [...databaseData.heroProducts];
      this.lastUpdated = databaseData.lastUpdated;
    }
  }

  // Save database to localStorage
  private saveDatabase() {
    try {
      const data = {
        products: this.products,
        heroProducts: this.heroProducts,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('solestyle_database', JSON.stringify(data));
      console.log('Database saved successfully');
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // Get all products
  getAllProducts(): Product[] {
    return [...this.products];
  }

  // Get product by ID
  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  // Add new product
  addProduct(productData: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };

    this.products.push(newProduct);
    this.saveDatabase();
    return newProduct;
  }

  // Update existing product
  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...updates };
    this.saveDatabase();
    return this.products[index];
  }

  // Delete product
  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    // Remove from hero products if it exists there
    this.heroProducts = this.heroProducts.filter(heroId => heroId !== id);
    this.saveDatabase();
    return true;
  }

  // Get hero products
  getHeroProducts(): string[] {
    return [...this.heroProducts];
  }

  // Update hero products
  updateHeroProducts(heroProductIds: string[]): void {
    this.heroProducts = heroProductIds.filter(id => 
      this.products.some(product => product.id === id)
    );
    this.saveDatabase();
  }

  // Get products by category
  getProductsByCategory(category: string): Product[] {
    if (category === 'all') return this.getAllProducts();
    return this.products.filter(product => product.category === category);
  }

  // Search products
  searchProducts(query: string): Product[] {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.subcategory.toLowerCase().includes(searchTerm)
    );
  }

  // Export database (for backup)
  exportDatabase() {
    return {
      products: this.products,
      heroProducts: this.heroProducts,
      lastUpdated: this.lastUpdated
    };
  }

  // Import database (for restore)
  importDatabase(data: any) {
    try {
      this.products = data.products || [];
      this.heroProducts = data.heroProducts || [];
      this.lastUpdated = data.lastUpdated || new Date().toISOString();
      this.saveDatabase();
      return true;
    } catch (error) {
      console.error('Error importing database:', error);
      return false;
    }
  }
}

// Create singleton instance
export const database = new DatabaseManager();

// Export convenience functions
export const getAllProducts = () => database.getAllProducts();
export const getProductById = (id: string) => database.getProductById(id);
export const addProduct = (product: Omit<Product, 'id'>) => database.addProduct(product);
export const updateProduct = (id: string, updates: Partial<Product>) => database.updateProduct(id, updates);
export const deleteProduct = (id: string) => database.deleteProduct(id);
export const getHeroProducts = () => database.getHeroProducts();
export const updateHeroProducts = (heroIds: string[]) => database.updateHeroProducts(heroIds);
export const getProductsByCategory = (category: string) => database.getProductsByCategory(category);
export const searchProducts = (query: string) => database.searchProducts(query);
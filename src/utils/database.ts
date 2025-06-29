import { Product } from '../types';
import databaseData from '../data/database.json';

// Event system for real-time updates
type DatabaseEventType = 'products_updated' | 'hero_updated';
type DatabaseEventListener = () => void;

class DatabaseEventEmitter {
  private listeners: Map<DatabaseEventType, DatabaseEventListener[]> = new Map();

  on(event: DatabaseEventType, listener: DatabaseEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: DatabaseEventType, listener: DatabaseEventListener) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit(event: DatabaseEventType) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener());
    }
  }
}

// In-memory database that syncs with localStorage
class DatabaseManager extends DatabaseEventEmitter {
  private products: Product[] = [];
  private heroProducts: string[] = [];
  private lastUpdated: string = '';

  constructor() {
    super();
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
        console.log(`Loaded ${this.products.length} products from localStorage`);
      } else {
        // Load from JSON file as fallback - create new array copies to avoid Vite HMR conflicts
        this.products = [...databaseData.products] as Product[];
        this.heroProducts = [...databaseData.heroProducts];
        this.lastUpdated = databaseData.lastUpdated;
        this.saveDatabase();
        console.log(`Loaded ${this.products.length} products from JSON fallback`);
      }
    } catch (error) {
      console.error('Error loading database:', error);
      // Fallback to JSON data - create new array copies to avoid Vite HMR conflicts
      this.products = [...databaseData.products] as Product[];
      this.heroProducts = [...databaseData.heroProducts];
      this.lastUpdated = databaseData.lastUpdated;
      console.log(`Loaded ${this.products.length} products from error fallback`);
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
      console.log(`Database saved successfully with ${this.products.length} products`);
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
    this.emit('products_updated');
    console.log(`Added new product: ${newProduct.name} (ID: ${newProduct.id})`);
    return newProduct;
  }

  // Update existing product
  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      console.warn(`Product with ID ${id} not found for update`);
      return null;
    }

    this.products[index] = { ...this.products[index], ...updates };
    this.saveDatabase();
    this.emit('products_updated');
    console.log(`Updated product: ${this.products[index].name} (ID: ${id})`);
    return this.products[index];
  }

  // Delete product
  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      console.warn(`Product with ID ${id} not found for deletion`);
      return false;
    }

    const deletedProduct = this.products[index];
    this.products.splice(index, 1);
    // Remove from hero products if it exists there
    this.heroProducts = this.heroProducts.filter(heroId => heroId !== id);
    this.saveDatabase();
    this.emit('products_updated');
    this.emit('hero_updated');
    console.log(`Deleted product: ${deletedProduct.name} (ID: ${id})`);
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
    this.emit('hero_updated');
    console.log(`Updated hero products: ${this.heroProducts.join(', ')}`);
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
      this.emit('products_updated');
      this.emit('hero_updated');
      console.log(`Imported database with ${this.products.length} products`);
      return true;
    } catch (error) {
      console.error('Error importing database:', error);
      return false;
    }
  }

  // Force reload from storage (useful for syncing across tabs)
  reloadFromStorage() {
    this.loadDatabase();
    this.emit('products_updated');
    this.emit('hero_updated');
    console.log('Database reloaded from storage');
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

// Export event system for components to subscribe to updates
export const onProductsUpdated = (callback: () => void) => database.on('products_updated', callback);
export const onHeroUpdated = (callback: () => void) => database.on('hero_updated', callback);
export const offProductsUpdated = (callback: () => void) => database.off('products_updated', callback);
export const offHeroUpdated = (callback: () => void) => database.off('hero_updated', callback);
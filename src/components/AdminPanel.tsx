import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Star, Eye, Filter, Search, Cloud, CloudOff, Download, Users, MessageSquare, BarChart3, Settings, RefreshCw } from 'lucide-react';
import { Product, Category } from '../types';
import { categories } from '../data/products';
import { database } from '../utils/database';
import { cloudStorage, uploadToCloud, downloadFromCloud, hasCloudBackup, getCloudBackupInfo } from '../utils/cloudStorage';
import { userDatabase, getAllUsers, getUserStats } from '../utils/userDatabase';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'hero' | 'users' | 'contacts' | 'analytics' | 'cloud'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [heroProducts, setHeroProducts] = useState<string[]>(['1', '2', '3']);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected');
  const [cloudBackupInfo, setCloudBackupInfo] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState<[number, number]>([0, 500]);
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: 'luxurious',
    subcategory: 'luxury-formal',
    description: '',
    sizes: [],
    colors: [],
    inStock: true,
    rating: 4.5,
    reviews: 0
  });

  // Load data on mount
  useEffect(() => {
    loadAllData();
    checkCloudStatus();
  }, []);

  const loadAllData = () => {
    try {
      // Load products
      const allProducts = database.getAllProducts();
      console.log(`AdminPanel: Loaded ${allProducts.length} products`);
      setProducts(allProducts);

      // Load hero products
      const heroIds = database.getHeroProducts();
      setHeroProducts(heroIds);

      // Load users
      const allUsers = getAllUsers();
      setUsers(allUsers);

      // Load user stats
      const stats = getUserStats();
      setUserStats(stats);

      // Load contacts
      const savedContacts = JSON.parse(localStorage.getItem('solestyle_contacts') || '[]');
      setContacts(savedContacts);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      // Force reload from storage
      database.reloadFromStorage();
      loadAllData();
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const checkCloudStatus = async () => {
    try {
      setCloudStatus('syncing');
      const hasBackup = await hasCloudBackup();
      const backupInfo = await getCloudBackupInfo();
      
      setCloudBackupInfo(backupInfo);
      setCloudStatus(hasBackup ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Error checking cloud status:', error);
      setCloudStatus('disconnected');
    }
  };

  const handleCloudBackup = async () => {
    try {
      setCloudStatus('syncing');
      
      const cloudData = {
        products: database.getAllProducts(),
        heroProducts: database.getHeroProducts(),
        contacts: JSON.parse(localStorage.getItem('solestyle_contacts') || '[]'),
        users: userDatabase.exportUserData().users,
        timestamp: new Date().toISOString()
      };

      await uploadToCloud(cloudData);
      await checkCloudStatus();
      alert('Data successfully backed up to cloud!');
    } catch (error) {
      console.error('Cloud backup failed:', error);
      setCloudStatus('disconnected');
      alert('Cloud backup failed. Please try again.');
    }
  };

  const handleCloudRestore = async () => {
    if (!confirm('This will replace all current data with cloud backup. Are you sure?')) {
      return;
    }

    try {
      setCloudStatus('syncing');
      
      const cloudData = await downloadFromCloud();
      if (!cloudData) {
        throw new Error('No cloud backup found');
      }

      // Restore products
      if (cloudData.products) {
        // Clear current products and import from cloud
        localStorage.setItem('solestyle_database', JSON.stringify({
          products: cloudData.products,
          heroProducts: cloudData.heroProducts || [],
          lastUpdated: cloudData.timestamp
        }));
      }

      // Restore users
      if (cloudData.users) {
        userDatabase.importUserData({ users: cloudData.users });
      }

      // Restore contacts
      if (cloudData.contacts) {
        localStorage.setItem('solestyle_contacts', JSON.stringify(cloudData.contacts));
      }

      // Reload all data
      loadAllData();
      await checkCloudStatus();
      
      alert('Data successfully restored from cloud backup!');
    } catch (error) {
      console.error('Cloud restore failed:', error);
      setCloudStatus('disconnected');
      alert('Cloud restore failed: ' + error.message);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('Please fill in all required fields (Name, Price, Image)');
      return;
    }

    try {
      const productData = {
        name: newProduct.name!,
        price: newProduct.price!,
        originalPrice: newProduct.originalPrice,
        image: newProduct.image!,
        category: newProduct.category!,
        subcategory: newProduct.subcategory!,
        description: newProduct.description!,
        sizes: newProduct.sizes!,
        colors: newProduct.colors!,
        inStock: newProduct.inStock!,
        rating: newProduct.rating!,
        reviews: newProduct.reviews!
      };

      const addedProduct = database.addProduct(productData);
      console.log('Product added successfully:', addedProduct);
      
      // Refresh products list
      setProducts(database.getAllProducts());
      
      setIsAddingProduct(false);
      setNewProduct({
        name: '',
        price: 0,
        originalPrice: 0,
        image: '',
        category: 'luxurious',
        subcategory: 'luxury-formal',
        description: '',
        sizes: [],
        colors: [],
        inStock: true,
        rating: 4.5,
        reviews: 0
      });
      setHasUnsavedChanges(true);
      
      alert(`Product "${addedProduct.name}" added successfully! It should now appear on the website.`);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;

    try {
      const updatedProduct = database.updateProduct(editingProduct.id, editingProduct);
      if (updatedProduct) {
        console.log('Product updated successfully:', updatedProduct);
        setProducts(database.getAllProducts());
        setEditingProduct(null);
        setHasUnsavedChanges(true);
        alert(`Product "${updatedProduct.name}" updated successfully!`);
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) {
      alert('Product not found');
      return;
    }

    if (confirm(`Are you sure you want to delete "${productToDelete.name}"?`)) {
      try {
        const success = database.deleteProduct(productId);
        if (success) {
          console.log('Product deleted successfully:', productId);
          setProducts(database.getAllProducts());
          
          // Remove from hero products if it's there
          const updatedHeroProducts = heroProducts.filter(id => id !== productId);
          setHeroProducts(updatedHeroProducts);
          database.updateHeroProducts(updatedHeroProducts);
          
          setHasUnsavedChanges(true);
          alert(`Product "${productToDelete.name}" deleted successfully!`);
        } else {
          throw new Error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleHeroProductChange = (index: number, productId: string) => {
    const newHeroProducts = [...heroProducts];
    newHeroProducts[index] = productId;
    setHeroProducts(newHeroProducts);
    database.updateHeroProducts(newHeroProducts);
    setHasUnsavedChanges(true);
    console.log('Hero products updated:', newHeroProducts);
  };

  const handleSaveChanges = async () => {
    try {
      // All changes are already saved to database automatically
      setHasUnsavedChanges(false);
      
      // Optionally trigger cloud backup
      if (cloudStatus === 'connected') {
        await handleCloudBackup();
      }
      
      alert('All changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  const getSubcategories = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.subcategories || [];
  };

  // Get all unique sizes from products
  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes)))
    .sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }

    // Price range filter
    if (product.price < priceRangeFilter[0] || product.price > priceRangeFilter[1]) {
      return false;
    }

    // Size filter
    if (sizeFilter !== 'all' && !product.sizes.includes(sizeFilter)) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPriceRangeFilter([0, 500]);
    setSizeFilter('all');
  };

  const handleInputChange = (field: string, value: any, product: Partial<Product>, onChange: (product: Partial<Product>) => void) => {
    onChange({ ...product, [field]: value });
  };

  const ProductForm = ({ product, onChange, isNew = false }: { 
    product: Partial<Product>, 
    onChange: (product: Partial<Product>) => void,
    isNew?: boolean 
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            value={product.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value, product, onChange)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            value={product.price || ''}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0, product, onChange)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original Price
          </label>
          <input
            type="number"
            step="0.01"
            value={product.originalPrice || ''}
            onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || undefined, product, onChange)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating (0-5)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={product.rating || ''}
            onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0, product, onChange)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL *
        </label>
        <input
          type="url"
          value={product.image || ''}
          onChange={(e) => handleInputChange('image', e.target.value, product, onChange)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
          required
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={product.category || ''}
            onChange={(e) => {
              const category = e.target.value;
              const subcategories = getSubcategories(category);
              onChange({ 
                ...product, 
                category,
                subcategory: subcategories[0]?.id || ''
              });
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategory *
          </label>
          <select
            value={product.subcategory || ''}
            onChange={(e) => handleInputChange('subcategory', e.target.value, product, onChange)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {getSubcategories(product.category || 'luxurious').map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={product.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value, product, onChange)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            value={product.sizes?.join(', ') || ''}
            onChange={(e) => handleInputChange('sizes', e.target.value.split(',').map(s => s.trim()).filter(s => s), product, onChange)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="7, 8, 9, 10, 11, 12"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            value={product.colors?.join(', ') || ''}
            onChange={(e) => handleInputChange('colors', e.target.value.split(',').map(c => c.trim()).filter(c => c), product, onChange)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Black, White, Brown"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={product.inStock || false}
            onChange={(e) => handleInputChange('inStock', e.target.checked, product, onChange)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">In Stock</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reviews Count
          </label>
          <input
            type="number"
            value={product.reviews || ''}
            onChange={(e) => handleInputChange('reviews', parseInt(e.target.value) || 0, product, onChange)}
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
              <p className="text-purple-100 mt-1">Manage products, users, and cloud storage</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Refresh Button */}
              <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white hover:bg-white/30 transition-colors flex items-center space-x-2"
                title="Refresh data from database"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="text-sm">Refresh</span>
              </button>

              {/* Cloud Status Indicator */}
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                {cloudStatus === 'connected' && <Cloud size={20} className="text-green-400" />}
                {cloudStatus === 'disconnected' && <CloudOff size={20} className="text-red-400" />}
                {cloudStatus === 'syncing' && <Cloud size={20} className="text-yellow-400 animate-pulse" />}
                <span className="text-white text-sm">
                  {cloudStatus === 'connected' && 'Cloud Connected'}
                  {cloudStatus === 'disconnected' && 'Cloud Disconnected'}
                  {cloudStatus === 'syncing' && 'Syncing...'}
                </span>
              </div>
              
              {hasUnsavedChanges && (
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 animate-pulse"
                >
                  <Save size={20} />
                  <span>Save All Changes</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'hero'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hero Section
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'contacts'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Messages ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'cloud'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cloud Storage
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'products' && (
            <div>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-semibold">Products ({filteredProducts.length})</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      showFilters ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Filter size={18} />
                    <span>Filters</span>
                  </button>
                </div>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Filters Section */}
              {showFilters && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Products
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search by name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Size Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                      </label>
                      <select
                        value={sizeFilter}
                        onChange={(e) => setSizeFilter(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="all">All Sizes</option>
                        {allSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRangeFilter[0]}
                          onChange={(e) => setPriceRangeFilter([Number(e.target.value), priceRangeFilter[1]])}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRangeFilter[1]}
                          onChange={(e) => setPriceRangeFilter([priceRangeFilter[0], Number(e.target.value)])}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={clearFilters}
                      className="text-gray-600 hover:text-gray-800 text-sm underline"
                    >
                      Clear All Filters
                    </button>
                    <div className="text-sm text-gray-600">
                      Showing {filteredProducts.length} of {products.length} products
                    </div>
                  </div>
                </div>
              )}

              {isAddingProduct && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold mb-4 text-green-800">Add New Product</h4>
                  <ProductForm 
                    product={newProduct} 
                    onChange={setNewProduct}
                    isNew={true}
                  />
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleAddProduct}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Add Product to Database</span>
                    </button>
                    <button
                      onClick={() => setIsAddingProduct(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {editingProduct && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold mb-4 text-blue-800">Edit Product</h4>
                  <ProductForm 
                    product={editingProduct} 
                    onChange={setEditingProduct}
                  />
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Update Product</span>
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.category} - {product.subcategory}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-lg">${product.price}</span>
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Sizes: {product.sizes.join(', ')}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">
                    {products.length === 0 
                      ? 'No products in database. Add some products to get started!' 
                      : 'No products found matching your criteria.'
                    }
                  </p>
                  {products.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'hero' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Hero Section Management</h3>
              <p className="text-gray-600 mb-6">
                Select products to display in the hero section of the homepage. You can add up to 6 hero products.
              </p>
              
              <div className="space-y-6">
                {[0, 1, 2, 3, 4, 5].map(index => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Hero Product {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Product
                        </label>
                        <select
                          value={heroProducts[index] || ''}
                          onChange={(e) => handleHeroProductChange(index, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select a product...</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} - ${product.price} ({product.category})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        {heroProducts[index] && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            {(() => {
                              const product = products.find(p => p.id === heroProducts[index]);
                              return product ? (
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div>
                                    <h5 className="font-medium">{product.name}</h5>
                                    <p className="text-sm text-gray-600">${product.price}</p>
                                    <div className="flex items-center">
                                      <Star size={12} className="text-yellow-400 fill-current" />
                                      <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                                    </div>
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                      {product.category}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">Product not found</p>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <Eye className="text-green-600 mr-2" size={20} />
                  <span className="text-green-800 font-medium">
                    Changes will be reflected on the homepage hero section immediately.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Cloud Storage Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Cloud Status Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Cloud Status</h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cloudStatus === 'connected' ? 'bg-green-100 text-green-800' :
                      cloudStatus === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cloudStatus === 'connected' && 'Connected'}
                      {cloudStatus === 'disconnected' && 'Disconnected'}
                      {cloudStatus === 'syncing' && 'Syncing...'}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {cloudStatus === 'connected' ? (
                        <Cloud size={20} className="text-green-600" />
                      ) : cloudStatus === 'syncing' ? (
                        <Cloud size={20} className="text-yellow-600 animate-pulse" />
                      ) : (
                        <CloudOff size={20} className="text-red-600" />
                      )}
                      <span className="text-gray-700">
                        {cloudStatus === 'connected' && 'Cloud backup is available and up to date'}
                        {cloudStatus === 'disconnected' && 'No cloud backup found or connection failed'}
                        {cloudStatus === 'syncing' && 'Synchronizing with cloud storage...'}
                      </span>
                    </div>
                    
                    {cloudBackupInfo && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">
                          <strong>Last Backup:</strong> {new Date(cloudBackupInfo.lastModified).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Size:</strong> {(cloudBackupInfo.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cloud Actions Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Cloud Actions</h4>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleCloudBackup}
                      disabled={cloudStatus === 'syncing'}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Upload size={18} />
                      <span>Backup to Cloud</span>
                    </button>
                    
                    <button
                      onClick={handleCloudRestore}
                      disabled={cloudStatus === 'syncing' || cloudStatus === 'disconnected'}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download size={18} />
                      <span>Restore from Cloud</span>
                    </button>
                    
                    <button
                      onClick={checkCloudStatus}
                      disabled={cloudStatus === 'syncing'}
                      className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Cloud size={18} />
                      <span>Check Status</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cloud Storage Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">About Cloud Storage</h4>
                <div className="space-y-3 text-blue-700">
                  <p>
                    <strong>Demo Mode:</strong> This demo uses localStorage as mock cloud storage. 
                    In production, this would integrate with services like Google Drive, AWS S3, or Firebase.
                  </p>
                  <p>
                    <strong>What gets backed up:</strong> All products, hero section settings, user data, and contact messages.
                  </p>
                  <p>
                    <strong>Automatic Backup:</strong> Data is automatically backed up when you save changes (if cloud is connected).
                  </p>
                  <p>
                    <strong>Data Safety:</strong> Always backup your data before making major changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs remain the same... */}
          {activeTab === 'users' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">User Management</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600">User management features coming soon...</p>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Total Users: {users.length}</p>
                  <p className="text-sm text-gray-500">Active Users: {userStats.activeUsers || 0}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Messages</h3>
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No contact messages yet.</p>
                  </div>
                ) : (
                  contacts.map(contact => (
                    <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(contact.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Subject:</strong> {contact.subject}
                      </p>
                      <p className="text-gray-700">{contact.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Analytics Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                    </div>
                    <BarChart3 className="text-blue-600" size={32} />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    </div>
                    <Users className="text-green-600" size={32} />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Messages</p>
                      <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                    </div>
                    <MessageSquare className="text-purple-600" size={32} />
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Cloud Status</p>
                      <p className="text-sm font-bold text-gray-900 capitalize">{cloudStatus}</p>
                    </div>
                    {cloudStatus === 'connected' ? (
                      <Cloud className="text-green-600" size={32} />
                    ) : (
                      <CloudOff className="text-red-600" size={32} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
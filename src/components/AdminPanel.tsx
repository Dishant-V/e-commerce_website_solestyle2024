import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Star, Eye, Filter, Search, Cloud, Download, Users, MessageSquare, Settings, Database } from 'lucide-react';
import { Product, Category } from '../types';
import { categories } from '../data/products';
import { database } from '../utils/database';
import { cloudStorage } from '../utils/cloudStorage';
import { userDatabase } from '../utils/userDatabase';

interface AdminPanelProps {
  onClose: () => void;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'hero' | 'cloud' | 'users' | 'contacts'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [heroProducts, setHeroProducts] = useState<string[]>(['1', '2', '3']);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected');
  const [autoBackup, setAutoBackup] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState<[number, number]>([0, 500]);
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // New product form with proper state management
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'luxurious',
    subcategory: 'luxury-formal',
    description: '',
    sizes: '',
    colors: '',
    inStock: true,
    rating: '4.5',
    reviews: '0'
  });

  // Load data on component mount
  useEffect(() => {
    loadAllData();
    checkCloudStatus();
  }, []);

  const loadAllData = () => {
    // Load products
    const allProducts = database.getAllProducts();
    setProducts(allProducts);

    // Load hero products
    const heroIds = database.getHeroProducts();
    setHeroProducts(heroIds);

    // Load contacts
    const savedContacts = JSON.parse(localStorage.getItem('solestyle_contacts') || '[]');
    setContacts(savedContacts);

    // Load users
    const allUsers = userDatabase.getAllUsers();
    setUsers(allUsers);
  };

  const checkCloudStatus = async () => {
    try {
      const hasBackup = await cloudStorage.hasCloudBackup();
      setCloudStatus(hasBackup ? 'connected' : 'disconnected');
      
      if (hasBackup) {
        const backupInfo = await cloudStorage.getCloudBackupInfo();
        if (backupInfo) {
          setLastBackup(backupInfo.lastModified);
        }
      }
    } catch (error) {
      console.error('Error checking cloud status:', error);
      setCloudStatus('disconnected');
    }
  };

  // Handle input changes for new product form
  const handleNewProductChange = (field: string, value: any) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle input changes for editing product
  const handleEditProductChange = (field: string, value: any) => {
    if (editingProduct) {
      setEditingProduct(prev => prev ? ({
        ...prev,
        [field]: value
      }) : null);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.image.trim()) {
      alert('Please fill in all required fields (Name, Price, Image)');
      return;
    }

    try {
      const productData = {
        name: newProduct.name.trim(),
        price: parseFloat(newProduct.price) || 0,
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
        image: newProduct.image.trim(),
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        description: newProduct.description.trim(),
        sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: newProduct.colors.split(',').map(c => c.trim()).filter(c => c),
        inStock: newProduct.inStock,
        rating: parseFloat(newProduct.rating) || 4.5,
        reviews: parseInt(newProduct.reviews) || 0
      };

      const addedProduct = database.addProduct(productData);
      setProducts(database.getAllProducts());
      
      // Reset form
      setNewProduct({
        name: '',
        price: '',
        originalPrice: '',
        image: '',
        category: 'luxurious',
        subcategory: 'luxury-formal',
        description: '',
        sizes: '',
        colors: '',
        inStock: true,
        rating: '4.5',
        reviews: '0'
      });
      
      setIsAddingProduct(false);
      setHasUnsavedChanges(true);
      
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
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
        setProducts(database.getAllProducts());
        setEditingProduct(null);
        setHasUnsavedChanges(true);
        alert('Product updated successfully!');
      } else {
        alert('Error updating product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const deleted = database.deleteProduct(productId);
        if (deleted) {
          setProducts(database.getAllProducts());
          setHeroProducts(database.getHeroProducts());
          setHasUnsavedChanges(true);
          alert('Product deleted successfully!');
        } else {
          alert('Error deleting product. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleHeroProductChange = (index: number, productId: string) => {
    const newHeroProducts = [...heroProducts];
    newHeroProducts[index] = productId;
    setHeroProducts(newHeroProducts);
    database.updateHeroProducts(newHeroProducts);
    setHasUnsavedChanges(true);
  };

  // Cloud storage functions
  const handleCloudUpload = async () => {
    try {
      setCloudStatus('syncing');
      
      const cloudData = {
        products: database.getAllProducts(),
        heroProducts: database.getHeroProducts(),
        contacts: JSON.parse(localStorage.getItem('solestyle_contacts') || '[]'),
        users: userDatabase.getAllUsers(),
        timestamp: new Date().toISOString()
      };

      await cloudStorage.uploadToCloud(cloudData);
      
      setCloudStatus('connected');
      setLastBackup(new Date().toISOString());
      setHasUnsavedChanges(false);
      
      alert('Data successfully backed up to cloud!');
    } catch (error) {
      console.error('Cloud upload error:', error);
      setCloudStatus('disconnected');
      alert('Failed to upload to cloud. Please try again.');
    }
  };

  const handleCloudDownload = async () => {
    if (!confirm('This will replace all current data with cloud backup. Are you sure?')) {
      return;
    }

    try {
      setCloudStatus('syncing');
      
      const cloudData = await cloudStorage.downloadFromCloud();
      if (cloudData) {
        // Restore products
        if (cloudData.products) {
          database.importDatabase({
            products: cloudData.products,
            heroProducts: cloudData.heroProducts || [],
            lastUpdated: cloudData.timestamp
          });
        }

        // Restore contacts
        if (cloudData.contacts) {
          localStorage.setItem('solestyle_contacts', JSON.stringify(cloudData.contacts));
        }

        // Restore users
        if ((cloudData as any).users) {
          userDatabase.importUserData({ users: (cloudData as any).users });
        }

        // Reload all data
        loadAllData();
        
        setCloudStatus('connected');
        setHasUnsavedChanges(false);
        
        alert('Data successfully restored from cloud!');
      }
    } catch (error) {
      console.error('Cloud download error:', error);
      setCloudStatus('disconnected');
      alert('Failed to download from cloud. Please try again.');
    }
  };

  const handleExportData = () => {
    const exportData = {
      products: database.getAllProducts(),
      heroProducts: database.getHeroProducts(),
      contacts: JSON.parse(localStorage.getItem('solestyle_contacts') || '[]'),
      users: userDatabase.getAllUsers(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solestyle_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (confirm('This will replace all current data. Are you sure?')) {
          // Import products
          if (importData.products) {
            database.importDatabase({
              products: importData.products,
              heroProducts: importData.heroProducts || [],
              lastUpdated: importData.exportDate || new Date().toISOString()
            });
          }

          // Import contacts
          if (importData.contacts) {
            localStorage.setItem('solestyle_contacts', JSON.stringify(importData.contacts));
          }

          // Import users
          if (importData.users) {
            userDatabase.importUserData({ users: importData.users });
          }

          loadAllData();
          alert('Data imported successfully!');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
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
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }

    if (product.price < priceRangeFilter[0] || product.price > priceRangeFilter[1]) {
      return false;
    }

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

  const ProductForm = ({ 
    product, 
    onChange, 
    isNew = false 
  }: { 
    product: any, 
    onChange: (field: string, value: any) => void,
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
            value={isNew ? product.name : product.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            value={isNew ? product.price : product.price || ''}
            onChange={(e) => onChange('price', isNew ? e.target.value : parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="0.00"
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
            value={isNew ? product.originalPrice : product.originalPrice || ''}
            onChange={(e) => onChange('originalPrice', isNew ? e.target.value : parseFloat(e.target.value) || undefined)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
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
            value={isNew ? product.rating : product.rating || ''}
            onChange={(e) => onChange('rating', isNew ? e.target.value : parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="4.5"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL *
        </label>
        <input
          type="url"
          value={isNew ? product.image : product.image || ''}
          onChange={(e) => onChange('image', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={isNew ? product.category : product.category || ''}
            onChange={(e) => {
              const category = e.target.value;
              const subcategories = getSubcategories(category);
              onChange('category', category);
              onChange('subcategory', subcategories[0]?.id || '');
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
            value={isNew ? product.subcategory : product.subcategory || ''}
            onChange={(e) => onChange('subcategory', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {getSubcategories(isNew ? product.category : product.category || 'luxurious').map(sub => (
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
          value={isNew ? product.description : product.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Product description..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            value={isNew ? product.sizes : (Array.isArray(product.sizes) ? product.sizes.join(', ') : '')}
            onChange={(e) => onChange('sizes', isNew ? e.target.value : e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="7, 8, 9, 10, 11, 12"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            value={isNew ? product.colors : (Array.isArray(product.colors) ? product.colors.join(', ') : '')}
            onChange={(e) => onChange('colors', isNew ? e.target.value : e.target.value.split(',').map(c => c.trim()).filter(c => c))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Black, White, Brown"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isNew ? product.inStock : product.inStock || false}
            onChange={(e) => onChange('inStock', e.target.checked)}
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
            value={isNew ? product.reviews : product.reviews || ''}
            onChange={(e) => onChange('reviews', isNew ? e.target.value : parseInt(e.target.value) || 0)}
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
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
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                cloudStatus === 'connected' ? 'bg-green-500/20 text-green-100' :
                cloudStatus === 'syncing' ? 'bg-yellow-500/20 text-yellow-100' :
                'bg-red-500/20 text-red-100'
              }`}>
                <Cloud size={16} />
                <span className="text-sm capitalize">{cloudStatus}</span>
              </div>
              {hasUnsavedChanges && (
                <button
                  onClick={handleCloudUpload}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 animate-pulse"
                >
                  <Save size={20} />
                  <span>Backup to Cloud</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          {[
            { id: 'products', label: 'Products', icon: Database, count: products.length },
            { id: 'hero', label: 'Hero Section', icon: Star, count: heroProducts.length },
            { id: 'cloud', label: 'Cloud Storage', icon: Cloud },
            { id: 'users', label: 'Users', icon: Users, count: users.length },
            { id: 'contacts', label: 'Messages', icon: MessageSquare, count: contacts.length }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent size={18} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
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
                    onChange={handleNewProductChange}
                    isNew={true}
                  />
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={handleAddProduct}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Add Product</span>
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
                    onChange={handleEditProductChange}
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
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Clear Filters
                  </button>
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
                              ) : null;
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
                    Changes will be reflected on the homepage hero section after saving to cloud.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Cloud Storage Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Cloud className="mr-2" size={20} />
                    Cloud Backup
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        cloudStatus === 'connected' ? 'bg-green-100 text-green-800' :
                        cloudStatus === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cloudStatus === 'connected' ? 'Connected' :
                         cloudStatus === 'syncing' ? 'Syncing...' :
                         'Disconnected'}
                      </span>
                    </div>
                    {lastBackup && (
                      <div className="flex items-center justify-between">
                        <span>Last Backup:</span>
                        <span className="text-sm text-gray-600">
                          {new Date(lastBackup).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCloudUpload}
                        disabled={cloudStatus === 'syncing'}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Upload size={18} />
                        <span>Upload Now</span>
                      </button>
                      <button
                        onClick={handleCloudDownload}
                        disabled={cloudStatus === 'syncing'}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download size={18} />
                        <span>Download & Restore</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Settings className="mr-2" size={20} />
                    Local Backup
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Auto Backup:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoBackup}
                          onChange={(e) => setAutoBackup(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleExportData}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download size={18} />
                        <span>Export Data</span>
                      </button>
                      <label className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                        <Upload size={18} />
                        <span>Import Data</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-2">Cloud Storage Information</h4>
                <p className="text-blue-700 text-sm mb-4">
                  Your data is automatically backed up to secure cloud storage. This includes all products, 
                  user data, contact messages, and settings. You can restore your data from any device.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-medium text-gray-900">Products</div>
                    <div className="text-gray-600">{products.length} items</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-medium text-gray-900">Users</div>
                    <div className="text-gray-600">{users.length} registered</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-medium text-gray-900">Messages</div>
                    <div className="text-gray-600">{contacts.length} contacts</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">User Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                  <div className="text-sm text-blue-800">Total Users</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.isActive).length}
                  </div>
                  <div className="text-sm text-green-800">Active Users</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {users.filter(u => new Date(u.registrationDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-sm text-purple-800">New This Week</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {users.filter(u => u.orderHistory.length > 0).length}
                  </div>
                  <div className="text-sm text-orange-800">With Orders</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="font-semibold">Registered Users</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.registrationDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.stylePreference || 'Not set'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Messages</h3>
              
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No contact messages yet.
                  </div>
                ) : (
                  contacts.map(contact => (
                    <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(contact.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {contact.subject}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{contact.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
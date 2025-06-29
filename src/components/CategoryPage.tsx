import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { database, onProductsUpdated, offProductsUpdated } from '../utils/database';
import { categories } from '../data/products';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface CategoryPageProps {
  category: string;
  subcategory?: string;
  onProductClick: (product: Product) => void;
  onAuthRequired?: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ 
  category, 
  subcategory, 
  onProductClick, 
  onAuthRequired 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load products from database and set up real-time updates
  useEffect(() => {
    const loadProducts = () => {
      try {
        const allProducts = database.getAllProducts();
        console.log(`CategoryPage: Loaded ${allProducts.length} products`);
        setProducts(allProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading products in CategoryPage:', error);
        setIsLoading(false);
      }
    };

    // Initial load
    loadProducts();

    // Subscribe to real-time updates
    onProductsUpdated(loadProducts);

    // Cleanup subscription
    return () => {
      offProductsUpdated(loadProducts);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    if (category === 'all') return true;
    if (subcategory) {
      return product.category === category && product.subcategory === subcategory;
    }
    return product.category === category;
  });

  const applyFilters = () => {
    return filteredProducts.filter(product => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      // Size filter
      if (selectedSizes.length > 0) {
        if (!selectedSizes.some(size => product.sizes.includes(size))) {
          return false;
        }
      }
      
      // Color filter
      if (selectedColors.length > 0) {
        if (!selectedColors.some(color => product.colors.includes(color))) {
          return false;
        }
      }
      
      return true;
    });
  };

  const sortedProducts = [...applyFilters()].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const categoryName = category === 'all' ? 'All Products' : 
    categories.find(cat => cat.id === category)?.name || 'Products';
  
  const subcategoryName = subcategory ? 
    categories.find(cat => cat.id === category)?.subcategories.find(sub => sub.id === subcategory)?.name : '';

  const allSizes = Array.from(new Set(filteredProducts.flatMap(p => p.sizes)))
    .sort((a, b) => {
      // Sort sizes numerically
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });

  const allColors = Array.from(new Set(filteredProducts.flatMap(p => p.colors)));

  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5D3A8D] mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-4">
            Loading Products...
          </h2>
          <p className="text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">
            Please wait while we load the latest products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-2">
            {categoryName}
            {subcategoryName && (
              <span className="text-[#5D3A8D] ml-2">- {subcategoryName}</span>
            )}
          </h1>
          <p className="text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">
            {sortedProducts.length} products found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white dark:bg-[#2C2A29] p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#2C2A29] dark:text-[#F5F5F5]">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden text-[#2C2A29]/60 dark:text-[#F5F5F5]/60"
                >
                  <Filter size={20} />
                </button>
              </div>

              <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-[#2C2A29] dark:text-[#F5F5F5] mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-[#F5F5F5] dark:border-[#5D3A8D]/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent bg-white dark:bg-[#1a1a1a] text-[#2C2A29] dark:text-[#F5F5F5]"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-[#2C2A29] dark:text-[#F5F5F5] mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full border border-[#F5F5F5] dark:border-[#5D3A8D]/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent bg-white dark:bg-[#1a1a1a] text-[#2C2A29] dark:text-[#F5F5F5]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full border border-[#F5F5F5] dark:border-[#5D3A8D]/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent bg-white dark:bg-[#1a1a1a] text-[#2C2A29] dark:text-[#F5F5F5]"
                    />
                  </div>
                </div>

                {/* Sizes */}
                {allSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-[#2C2A29] dark:text-[#F5F5F5] mb-2">
                      Sizes
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {allSizes.map(size => (
                        <label
                          key={size}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSizes([...selectedSizes, size]);
                              } else {
                                setSelectedSizes(selectedSizes.filter(s => s !== size));
                              }
                            }}
                            className="rounded border-[#F5F5F5] dark:border-[#5D3A8D]/20 text-[#5D3A8D] focus:ring-[#5D3A8D]"
                          />
                          <span className="text-sm text-[#2C2A29] dark:text-[#F5F5F5]">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {allColors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-[#2C2A29] dark:text-[#F5F5F5] mb-2">
                      Colors
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {allColors.map(color => (
                        <label
                          key={color}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(color)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedColors([...selectedColors, color]);
                              } else {
                                setSelectedColors(selectedColors.filter(c => c !== color));
                              }
                            }}
                            className="rounded border-[#F5F5F5] dark:border-[#5D3A8D]/20 text-[#5D3A8D] focus:ring-[#5D3A8D]"
                          />
                          <span className="text-sm text-[#2C2A29] dark:text-[#F5F5F5]">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply/Clear Filters */}
                <div className="space-y-2">
                  <button
                    onClick={clearFilters}
                    className="w-full bg-[#A67C9D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#A67C9D]/80"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#5D3A8D]/10 text-[#5D3A8D]' : 'text-[#2C2A29]/60 dark:text-[#F5F5F5]/60'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#5D3A8D]/10 text-[#5D3A8D]' : 'text-[#2C2A29]/60 dark:text-[#F5F5F5]/60'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {sortedProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                    onAuthRequired={onAuthRequired}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#2C2A29]/60 dark:text-[#F5F5F5]/60 text-lg mb-4">
                  {filteredProducts.length === 0 
                    ? 'No products found in this category.' 
                    : 'No products found matching your criteria.'
                  }
                </p>
                {filteredProducts.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="bg-[#5D3A8D] text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
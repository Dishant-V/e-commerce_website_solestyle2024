import React, { useState, useEffect } from 'react';
import { ArrowRight, Truck, Shield, RotateCcw, Star, Zap, Crown, Sparkles } from 'lucide-react';
import { database, onProductsUpdated, offProductsUpdated } from '../utils/database';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onCategoryChange: (category: string, subcategory?: string) => void;
  onAuthRequired?: () => void;
}

const Home: React.FC<HomeProps> = ({ onProductClick, onCategoryChange, onAuthRequired }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load products from database and set up real-time updates
  useEffect(() => {
    const loadProducts = () => {
      try {
        const allProducts = database.getAllProducts();
        console.log(`Home: Loaded ${allProducts.length} products`);
        setProducts(allProducts);
        setFeaturedProducts(allProducts.slice(0, 6));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading products in Home:', error);
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

  // Get one product from each category for hero showcase
  const luxuriousProduct = products.find(p => p.category === 'luxurious');
  const classyProduct = products.find(p => p.category === 'classy');
  const funkyProduct = products.find(p => p.category === 'funky');

  const categoryProducts = [
    { product: luxuriousProduct, category: 'luxurious', name: 'Luxurious', icon: Crown },
    { product: classyProduct, category: 'classy', name: 'Classy', icon: Sparkles },
    { product: funkyProduct, category: 'funky', name: 'Funky', icon: Zap }
  ].filter(item => item.product) as Array<{
    product: Product;
    category: string;
    name: string;
    icon: any;
  }>;

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Auto-change category product every 4 seconds
  useEffect(() => {
    if (categoryProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentCategoryIndex(prev => (prev + 1) % categoryProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [categoryProducts.length]);

  const currentCategory = categoryProducts[currentCategoryIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5D3A8D] mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-4">
            Loading Products...
          </h2>
          <p className="text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">
            Please wait while we load the latest products from our database.
          </p>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-4">
            No Products Available
          </h2>
          <p className="text-[#2C2A29]/60 dark:text-[#F5F5F5]/60 mb-6">
            Please add some products through the admin panel to get started.
          </p>
          <button
            onClick={() => onCategoryChange('all')}
            className="bg-[#5D3A8D] text-white px-6 py-3 rounded-lg font-semibold"
          >
            View All Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1a1a1a]">
      {/* Hero Section with Urban Chic Design */}
      <section className="relative bg-gradient-to-br from-[#2C2A29] via-[#5D3A8D] to-[#000000] text-white overflow-hidden min-h-screen">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen flex items-center">
          <div className="w-full">
            {/* Top Section - Title and Description */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-[#A67C9D]/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-[#A67C9D]/30">
                <Sparkles className="w-5 h-5 mr-3 text-[#A67C9D]" />
                <span className="text-sm font-medium text-[#F5F5F5]">Premium Collection 2024</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Step Into
                <span className="block bg-gradient-to-r from-[#A67C9D] via-[#5D3A8D] to-[#A67C9D] bg-clip-text text-transparent">
                  Greatness
                </span>
              </h1>
              
              <p className="text-lg md:text-xl mb-8 text-[#F5F5F5]/90 max-w-3xl mx-auto leading-relaxed">
                Discover shoes that don't just complete your outfit—they define your journey. 
                From boardroom to street, we've got your every step covered.
              </p>
            </div>

            {/* Center Section - Product Showcase (Main Focus) */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Main Product Display Container */}
                <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
                  {/* Static Background Circle */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#A67C9D]/20 to-[#5D3A8D]/10 backdrop-blur-sm border border-[#A67C9D]/30"></div>
                  
                  {/* Decorative Ring */}
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#A67C9D]/50"></div>
                  
                  {/* Main Product Display */}
                  <div 
                    className="relative group cursor-pointer"
                    onClick={() => onProductClick(currentCategory.product)}
                  >
                    <div className="relative">
                      {/* Product Shadow */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-10 bg-[#000000]/30 rounded-full blur-xl opacity-60"></div>
                      
                      {/* Main Product Image */}
                      <img
                        src={currentCategory.product.image}
                        alt={currentCategory.product.name}
                        className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-3xl shadow-2xl"
                        style={{
                          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4))',
                          transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)'
                        }}
                      />
                      
                      {/* Product Info Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 bg-[#000000]/70 backdrop-blur-sm rounded-2xl p-3">
                        <h3 className="font-bold text-base text-[#F5F5F5] mb-1">
                          {currentCategory.product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star size={14} className="text-[#A67C9D] fill-current" />
                            <span className="text-[#F5F5F5]/90 ml-1 text-sm">{currentCategory.product.rating}</span>
                          </div>
                          <span className="text-[#A67C9D] font-semibold text-sm">{currentCategory.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Static Decorative Elements */}
                  <div className="absolute top-8 right-8 w-3 h-3 bg-[#A67C9D] rounded-full"></div>
                  <div className="absolute bottom-16 left-6 w-2 h-2 bg-[#5D3A8D] rounded-full"></div>
                  <div className="absolute top-24 left-8 w-1.5 h-1.5 bg-[#A67C9D] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Category Navigation Icons (Center Focus) */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-6">
                {categoryProducts.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.category}
                      onClick={() => {
                        setCurrentCategoryIndex(index);
                        onCategoryChange(item.category);
                      }}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all transform hover:scale-105 ${
                        index === currentCategoryIndex 
                          ? 'bg-[#A67C9D]/20 border-2 border-[#A67C9D]/50 shadow-lg' 
                          : 'bg-[#F5F5F5]/10 border-2 border-[#F5F5F5]/20 hover:bg-[#F5F5F5]/15'
                      }`}
                    >
                      <IconComponent 
                        size={28} 
                        className={index === currentCategoryIndex ? 'text-[#A67C9D]' : 'text-[#F5F5F5]/70'} 
                      />
                      <span className={`text-sm font-medium ${
                        index === currentCategoryIndex ? 'text-[#A67C9D]' : 'text-[#F5F5F5]/70'
                      }`}>
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shop Collection Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => onCategoryChange(currentCategory.category)}
                className="bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] text-white px-8 py-4 rounded-2xl text-lg font-semibold inline-flex items-center space-x-3 shadow-2xl transform hover:scale-105 transition-transform"
              >
                <span>Shop Collection</span>
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center mb-6">
              <div>
                <div className="text-3xl font-bold text-[#A67C9D]">50K+</div>
                <div className="text-sm text-[#F5F5F5]/80">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#A67C9D]">{products.length}+</div>
                <div className="text-sm text-[#F5F5F5]/80">Shoe Styles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#A67C9D]">25+</div>
                <div className="text-sm text-[#F5F5F5]/80">Countries</div>
              </div>
            </div>

            {/* Explore Styles Button */}
            <div className="flex justify-center">
              <button
                onClick={() => onCategoryChange('all')}
                className="border-2 border-[#A67C9D]/50 backdrop-blur-sm text-[#F5F5F5] px-8 py-3 rounded-2xl text-lg font-semibold inline-flex items-center justify-center space-x-3 hover:bg-[#A67C9D]/10 transition-colors"
              >
                <span>Explore Styles</span>
              </button>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#F5F5F5"
              className="dark:fill-[#1a1a1a]"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Welcome Message for Guests */}
      {!user && (
        <section className="py-6 bg-[#5D3A8D]/10 dark:bg-[#5D3A8D]/20 border-b border-[#5D3A8D]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#2C2A29] dark:text-[#F5F5F5]">
              Welcome to SoleStyle! Browse our collection and 
              <button 
                onClick={onAuthRequired}
                className="text-[#5D3A8D] font-semibold underline ml-1"
              >
                sign in
              </button> 
              {' '}to add items to your cart and enjoy a personalized shopping experience.
            </p>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-[#2C2A29]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#5D3A8D]/10 to-[#A67C9D]/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="text-[#5D3A8D]" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#2C2A29] dark:text-[#F5F5F5]">Free Shipping</h3>
              <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 text-sm">Free shipping on orders over $50. Fast delivery worldwide.</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#A67C9D]/10 to-[#5D3A8D]/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-[#A67C9D]" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#2C2A29] dark:text-[#F5F5F5]">Quality Guarantee</h3>
              <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 text-sm">Premium materials and craftsmanship in every pair.</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#5D3A8D]/10 to-[#A67C9D]/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="text-[#5D3A8D]" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#2C2A29] dark:text-[#F5F5F5]">Easy Returns</h3>
              <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 text-sm">30-day hassle-free returns and exchanges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-[#F5F5F5] dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 max-w-2xl mx-auto">
              Discover our handpicked selection of the finest shoes for every occasion
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
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
              <p className="text-[#2C2A29]/60 dark:text-[#F5F5F5]/60 text-lg">
                No featured products available. Add some products through the admin panel.
              </p>
            </div>
          )}
          
          <div className="text-center mt-10">
            <button
              onClick={() => onCategoryChange('all')}
              className="bg-[#5D3A8D] text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white dark:bg-[#2C2A29]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-[#2C2A29]/70 dark:text-[#F5F5F5]/70">
              Find the perfect shoes for your unique style
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => onCategoryChange('luxurious')}
              className="relative bg-gradient-to-br from-[#2C2A29] to-[#5D3A8D] rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div className="relative p-6 text-white text-center">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Luxurious</h3>
                <p className="mb-4 text-white/90 text-sm">Premium materials and elegant designs</p>
                <button className="bg-white text-[#2C2A29] px-5 py-2 rounded-xl font-semibold text-sm">
                  Shop Luxurious
                </button>
              </div>
            </div>
            
            <div
              onClick={() => onCategoryChange('classy')}
              className="relative bg-gradient-to-br from-[#A67C9D] to-[#5D3A8D] rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div className="relative p-6 text-white text-center">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Classy</h3>
                <p className="mb-4 text-white/90 text-sm">Sophisticated and timeless styles</p>
                <button className="bg-white text-[#A67C9D] px-5 py-2 rounded-xl font-semibold text-sm">
                  Shop Classy
                </button>
              </div>
            </div>
            
            <div
              onClick={() => onCategoryChange('funky')}
              className="relative bg-gradient-to-br from-[#5D3A8D] to-[#A67C9D] rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div className="relative p-6 text-white text-center">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Funky</h3>
                <p className="mb-4 text-white/90 text-sm">Bold and expressive designs</p>
                <button className="bg-white text-[#5D3A8D] px-5 py-2 rounded-xl font-semibold text-sm">
                  Shop Funky
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-[#F5F5F5] dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-4">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-[#2C2A29] p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="text-[#A67C9D] fill-current" />
                  ))}
                </div>
                <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 mb-4 text-sm">
                  "Amazing quality and comfort! I've been wearing these shoes for months and they still look brand new. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5D3A8D] to-[#A67C9D] rounded-full mr-3 flex items-center justify-center text-white font-semibold">
                    {i}
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C2A29] dark:text-[#F5F5F5]">Customer {i}</p>
                    <p className="text-sm text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
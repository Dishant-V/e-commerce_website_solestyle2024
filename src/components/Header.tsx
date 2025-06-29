import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search, Footprints, Settings, Heart, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { products } from '../data/products';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onCategoryChange: (category: string, subcategory?: string) => void;
  onCartAccess: () => void;
  onWishlistAccess: () => void;
  onAuthRequired: () => void;
  onStylePreferences: () => void;
  onProductClick?: (product: any) => void;
}

// Style categories based on the uploaded image
const styleCategories = [
  {
    id: 'luxurious',
    name: 'Luxurious',
    description: 'Premium materials, elegant designs',
    gradient: 'from-[#5D3A8D] to-[#A67C9D]',
    icon: '👑'
  },
  {
    id: 'classy',
    name: 'Classy',
    description: 'Sophisticated and timeless',
    gradient: 'from-[#2C2A29] to-[#5D3A8D]',
    icon: '✨'
  },
  {
    id: 'funky',
    name: 'Funky',
    description: 'Bold and expressive styles',
    gradient: 'from-[#A67C9D] to-[#5D3A8D]',
    icon: '🎨'
  }
];

const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  onPageChange, 
  onCategoryChange, 
  onCartAccess,
  onWishlistAccess,
  onAuthRequired,
  onStylePreferences,
  onProductClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems, priceDropItems } = useWishlist();
  const { isDark, toggleTheme } = useTheme();

  // Improved search with typo detection
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      // First, try exact matches
      let results = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(query.toLowerCase())
      );

      // If no exact matches, try fuzzy matching for typos
      if (results.length === 0) {
        const queryLower = query.toLowerCase();
        
        // Common typos and their corrections
        const typoCorrections: { [key: string]: string } = {
          'loafir': 'loafer',
          'loafirs': 'loafers',
          'lofer': 'loafer',
          'lofers': 'loafers',
          'sneeker': 'sneaker',
          'sneekers': 'sneakers',
          'sniker': 'sneaker',
          'snikers': 'sneakers',
          'boot': 'boots',
          'heel': 'heels',
          'sandel': 'sandal',
          'sandels': 'sandals',
          'runing': 'running',
          'runer': 'runner',
          'runers': 'runners',
          'clasic': 'classic',
          'elegent': 'elegant',
          'comfy': 'comfortable',
          'comfotable': 'comfortable'
        };

        // Check for typo corrections
        let correctedQuery = queryLower;
        for (const [typo, correction] of Object.entries(typoCorrections)) {
          if (queryLower.includes(typo)) {
            correctedQuery = queryLower.replace(typo, correction);
            break;
          }
        }

        // Search with corrected query
        if (correctedQuery !== queryLower) {
          results = products.filter(product => 
            product.name.toLowerCase().includes(correctedQuery) ||
            product.description.toLowerCase().includes(correctedQuery) ||
            product.category.toLowerCase().includes(correctedQuery) ||
            product.subcategory.toLowerCase().includes(correctedQuery)
          );
        }

        // If still no results, find similar products
        if (results.length === 0) {
          const similarProducts = products.filter(product => {
            const queryWords = query.toLowerCase().split(' ');
            return queryWords.some(word => 
              product.name.toLowerCase().includes(word) ||
              product.category.toLowerCase().includes(word) ||
              product.colors.some(color => color.toLowerCase().includes(word)) ||
              // Partial matching for similar words
              product.name.toLowerCase().includes(word.substring(0, 3)) ||
              word.includes(product.name.toLowerCase().substring(0, 3))
            );
          }).slice(0, 3);

          setSearchResults([
            { type: 'no-results', query, similarProducts, suggestion: correctedQuery !== queryLower ? correctedQuery : null }
          ]);
        } else {
          setSearchResults([
            { type: 'corrected', query, correctedQuery, results: results.slice(0, 5) }
          ]);
        }
      } else {
        setSearchResults(results.slice(0, 5));
      }
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (product: any) => {
    if (onProductClick) {
      onProductClick(product);
    }
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleCategoryClick = (categoryId: string, subcategoryId?: string) => {
    onCategoryChange(categoryId, subcategoryId);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleUserAction = () => {
    if (user) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      onAuthRequired();
    }
  };

  return (
    <header className="bg-white dark:bg-[#2C2A29] shadow-lg sticky top-0 z-40 border-b border-[#F5F5F5] dark:border-[#5D3A8D]/20">
      {/* Top Bar */}
      <div className="bg-[#2C2A29] dark:bg-[#1a1a1a] text-[#F5F5F5] py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span>Free shipping on orders over $50</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">30-day returns</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">Customer Service: 1-800-SOLE-STYLE</span>
              <div className="flex space-x-2">
                <button className="text-[#A67C9D]">EN</button>
                <span>|</span>
                <button className="text-[#A67C9D]">USD</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handlePageChange('home')}>
            <Footprints className="h-10 w-10 text-[#5D3A8D]" />
            <div>
              <span className="text-3xl font-bold text-[#2C2A29] dark:text-[#F5F5F5]">SoleStyle</span>
              <div className="text-xs text-[#A67C9D] -mt-1">Premium Footwear</div>
            </div>
          </div>

          {/* Desktop Navigation with Style Categories */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => handlePageChange('home')}
              className={`text-[#2C2A29] dark:text-[#F5F5F5] font-medium py-2 border-b-2 ${
                currentPage === 'home' ? 'text-[#5D3A8D] border-[#5D3A8D]' : 'border-transparent'
              }`}
            >
              Home
            </button>
            
            {/* Style Categories Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('styles')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`flex items-center space-x-1 text-[#2C2A29] dark:text-[#F5F5F5] font-medium py-2 border-b-2 ${
                  currentPage === 'category' ? 'text-[#5D3A8D] border-[#5D3A8D]' : 'border-transparent'
                }`}
              >
                <span>Collections</span>
                <ChevronDown size={16} />
              </button>
              
              {/* Style Categories Mega Menu */}
              <div className={`absolute left-0 mt-2 w-96 bg-white dark:bg-[#2C2A29] rounded-xl shadow-2xl border border-[#F5F5F5] dark:border-[#5D3A8D]/20 ${
                activeDropdown === 'styles' ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-4 border-b border-[#F5F5F5] dark:border-[#5D3A8D]/20 pb-2">
                    Shop by Style
                  </h3>
                  <div className="space-y-4">
                    {styleCategories.map(style => (
                      <button
                        key={style.id}
                        onClick={() => handleCategoryClick(style.id)}
                        className={`w-full text-left p-4 rounded-lg bg-gradient-to-r ${style.gradient} text-white hover:shadow-lg`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{style.icon}</span>
                          <div>
                            <div className="font-bold text-lg">{style.name}</div>
                            <div className="text-sm opacity-90">{style.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <button
                      onClick={() => handleCategoryClick('all')}
                      className="w-full bg-white/20 backdrop-blur-sm text-[#2C2A29] dark:text-[#F5F5F5] py-2 px-4 rounded-lg font-medium"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePageChange('about')}
              className={`text-[#2C2A29] dark:text-[#F5F5F5] font-medium py-2 border-b-2 ${
                currentPage === 'about' ? 'text-[#5D3A8D] border-[#5D3A8D]' : 'border-transparent'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handlePageChange('contact')}
              className={`text-[#2C2A29] dark:text-[#F5F5F5] font-medium py-2 border-b-2 ${
                currentPage === 'contact' ? 'text-[#5D3A8D] border-[#5D3A8D]' : 'border-transparent'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C2A29]/40 dark:text-[#F5F5F5]/40" size={20} />
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="pl-10 pr-4 py-3 border border-[#F5F5F5] dark:border-[#5D3A8D]/20 rounded-xl focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent w-80 bg-[#F5F5F5] dark:bg-[#1a1a1a] focus:bg-white dark:focus:bg-[#2C2A29] text-[#2C2A29] dark:text-[#F5F5F5]"
              />
              
              {/* Enhanced Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#2C2A29] rounded-xl shadow-2xl border border-[#F5F5F5] dark:border-[#5D3A8D]/20 max-h-96 overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    searchResults[0].type === 'no-results' ? (
                      <div className="p-4">
                        <p className="text-[#2C2A29] dark:text-[#F5F5F5] mb-3">
                          {searchResults[0].suggestion ? (
                            <>Did you mean "<span className="font-semibold text-[#5D3A8D]">{searchResults[0].suggestion}</span>"?</>
                          ) : (
                            <>Oops! We don't have "{searchResults[0].query}" but we have these similar products:</>
                          )}
                        </p>
                        {searchResults[0].similarProducts.map((product: any) => (
                          <div
                            key={product.id}
                            onClick={() => handleSearchResultClick(product)}
                            className="flex items-center space-x-3 p-3 hover:bg-[#F5F5F5] dark:hover:bg-[#5D3A8D]/10 cursor-pointer rounded-lg"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium text-[#2C2A29] dark:text-[#F5F5F5]">{product.name}</h4>
                              <p className="text-sm text-[#A67C9D]">${product.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchResults[0].type === 'corrected' ? (
                      <div className="p-4">
                        <p className="text-[#2C2A29] dark:text-[#F5F5F5] mb-3">
                          Showing results for "<span className="font-semibold text-[#5D3A8D]">{searchResults[0].correctedQuery}</span>"
                        </p>
                        {searchResults[0].results.map((product: any) => (
                          <div
                            key={product.id}
                            onClick={() => handleSearchResultClick(product)}
                            className="flex items-center space-x-3 p-3 hover:bg-[#F5F5F5] dark:hover:bg-[#5D3A8D]/10 cursor-pointer rounded-lg"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium text-[#2C2A29] dark:text-[#F5F5F5]">{product.name}</h4>
                              <p className="text-sm text-[#A67C9D]">${product.price}</p>
                              <p className="text-xs text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">{product.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2">
                        {searchResults.map((product: any) => (
                          <div
                            key={product.id}
                            onClick={() => handleSearchResultClick(product)}
                            className="flex items-center space-x-3 p-3 hover:bg-[#F5F5F5] dark:hover:bg-[#5D3A8D]/10 cursor-pointer rounded-lg"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium text-[#2C2A29] dark:text-[#F5F5F5]">{product.name}</h4>
                              <p className="text-sm text-[#A67C9D]">${product.price}</p>
                              <p className="text-xs text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">{product.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="p-4 text-center text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">
                      Start typing to search...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 text-[#2C2A29] dark:text-[#F5F5F5] rounded-xl bg-[#F5F5F5] dark:bg-[#5D3A8D]/20 hover:bg-[#5D3A8D]/10 dark:hover:bg-[#5D3A8D]/30"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {/* Wishlist */}
            <button
              onClick={onWishlistAccess}
              className="relative p-3 text-[#2C2A29] dark:text-[#F5F5F5] rounded-xl bg-[#F5F5F5] dark:bg-[#5D3A8D]/20 hover:bg-[#5D3A8D]/10 dark:hover:bg-[#5D3A8D]/30"
            >
              <Heart size={24} />
              {user && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#5D3A8D] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                  {wishlistItems.length}
                </span>
              )}
              {user && priceDropItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#A67C9D] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onCartAccess}
              className="relative p-3 text-[#2C2A29] dark:text-[#F5F5F5] rounded-xl bg-[#F5F5F5] dark:bg-[#5D3A8D]/20 hover:bg-[#5D3A8D]/10 dark:hover:bg-[#5D3A8D]/30"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A67C9D] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={handleUserAction}
                className="flex items-center space-x-3 text-[#2C2A29] dark:text-[#F5F5F5] p-3 rounded-xl bg-[#F5F5F5] dark:bg-[#5D3A8D]/20 hover:bg-[#5D3A8D]/10 dark:hover:bg-[#5D3A8D]/30"
              >
                <User size={24} />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium">
                    {user ? user.name : 'Sign In'}
                  </div>
                </div>
                {user && <ChevronDown size={16} />}
              </button>
              
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#2C2A29] rounded-xl shadow-2xl border border-[#F5F5F5] dark:border-[#5D3A8D]/20 py-2 z-50">
                  <div className="px-4 py-3 border-b border-[#F5F5F5] dark:border-[#5D3A8D]/20">
                    <p className="text-sm font-medium text-[#2C2A29] dark:text-[#F5F5F5]">{user.name}</p>
                    <p className="text-xs text-[#2C2A29]/60 dark:text-[#F5F5F5]/60">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onStylePreferences();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-3 text-[#2C2A29] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#5D3A8D]/10"
                  >
                    <Settings size={16} className="mr-3" />
                    Style Preferences
                  </button>
                  <button
                    onClick={() => {
                      handlePageChange('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-3 text-[#2C2A29] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#5D3A8D]/10"
                  >
                    <User size={16} className="mr-3" />
                    My Profile
                  </button>
                  <hr className="my-2 border-[#F5F5F5] dark:border-[#5D3A8D]/20" />
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-3 text-[#A67C9D] hover:bg-[#A67C9D]/10"
                  >
                    <span className="mr-3">→</span>
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 text-[#2C2A29] dark:text-[#F5F5F5] rounded-xl bg-[#F5F5F5] dark:bg-[#5D3A8D]/20"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#2C2A29] border-t border-[#F5F5F5] dark:border-[#5D3A8D]/20 py-4 space-y-2 max-h-96 overflow-y-auto">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C2A29]/40 dark:text-[#F5F5F5]/40" size={20} />
                <input
                  type="text"
                  placeholder="Search shoes..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#F5F5F5] dark:border-[#5D3A8D]/20 rounded-xl focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent bg-[#F5F5F5] dark:bg-[#1a1a1a] text-[#2C2A29] dark:text-[#F5F5F5]"
                />
              </div>
            </div>

            <button
              onClick={() => handlePageChange('home')}
              className="block w-full text-left px-4 py-3 text-[#2C2A29] dark:text-[#F5F5F5] font-medium hover:bg-[#F5F5F5] dark:hover:bg-[#5D3A8D]/10"
            >
              Home
            </button>
            
            {/* Mobile Style Categories */}
            <div className="px-4">
              <h3 className="text-sm font-semibold text-[#2C2A29] dark:text-[#F5F5F5] mb-2">Collections</h3>
              {styleCategories.map(style => (
                <button
                  key={style.id}
                  onClick={() => handleCategoryClick(style.id)}
                  className={`w-full text-left p-3 mb-2 rounded-lg bg-gradient-to-r ${style.gradient} text-white`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{style.icon}</span>
                    <span className="font-medium">{style.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange('about')}
              className="block w-full text-left px-4 py-3 text-[#2C2A29] dark:text-[#F5F5F5] font-medium hover:bg-[#F5F5F5] dark:hover:bg-[#5D3A8D]/10"
            >
              About
            </button>
            <button
              onClick={() => handlePageChange('contact')}
              className="block w-full text-left px-4 py-3 text-[#2C2A29] dark:text-[#F5F5F5] font-medium hover:bg-[#F5F5F5] dark:hover:bg-[#5D3A8D]/10"
            >
              Contact
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
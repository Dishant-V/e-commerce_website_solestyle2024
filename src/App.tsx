import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthModal from './components/AuthModal';
import StylePreferenceModal from './components/StylePreferenceModal';
import AdminPanel from './components/AdminPanel';
import SuperuserAuth from './components/SuperuserAuth';
import Header from './components/Header';
import Home from './components/Home';
import CategoryPage from './components/CategoryPage';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Checkout from './components/Checkout';
import About from './components/About';
import Policies from './components/Policies';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Product } from './types';

type Page = 'home' | 'category' | 'product' | 'cart' | 'wishlist' | 'checkout' | 'about' | 'policies' | 'contact' | 'profile' | 'orders' | 'privacy' | 'terms' | 'cookies';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authContext, setAuthContext] = useState<'checkout' | 'general'>('general');
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showSuperuserAuth, setShowSuperuserAuth] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [hasShownDelayedAuth, setHasShownDelayedAuth] = useState(false);
  
  const { user } = useAuth();

  // Show auth modal after 5 seconds for new visitors
  useEffect(() => {
    if (!user && !hasShownDelayedAuth) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
        setAuthContext('general');
        setHasShownDelayedAuth(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [user, hasShownDelayedAuth]);

  // Admin access (in a real app, this would be based on user roles)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowSuperuserAuth(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page);
    setSelectedProduct(null);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string, subcategory?: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory || '');
    setCurrentPage('category');
    setSelectedProduct(null);
    // Scroll to top when changing categories
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    // Scroll to top when viewing product
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToProducts = () => {
    if (selectedCategory) {
      setCurrentPage('category');
    } else {
      setCurrentPage('home');
    }
    setSelectedProduct(null);
    // Scroll to top when going back
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    if (!user) {
      setAuthContext('checkout');
      setShowAuthModal(true);
      return;
    }
    setCurrentPage('checkout');
    // Scroll to top for checkout
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCartAccess = () => {
    setCurrentPage('cart');
    // Scroll to top when accessing cart
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistAccess = () => {
    if (!user) {
      setAuthContext('general');
      setShowAuthModal(true);
      return;
    }
    setCurrentPage('wishlist');
    // Scroll to top when accessing wishlist
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = () => {
    setOrderCompleted(true);
    setCurrentPage('home');
    // Scroll to top after order completion
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthRequired = () => {
    setAuthContext('general');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleSuperuserSuccess = () => {
    setShowAdminPanel(true);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onProductClick={handleProductClick}
            onCategoryChange={handleCategoryChange}
            onAuthRequired={handleAuthRequired}
          />
        );
      case 'category':
        return (
          <CategoryPage
            category={selectedCategory}
            subcategory={selectedSubcategory}
            onProductClick={handleProductClick}
            onAuthRequired={handleAuthRequired}
          />
        );
      case 'product':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToProducts}
            onAuthRequired={handleAuthRequired}
          />
        ) : (
          <Home
            onProductClick={handleProductClick}
            onCategoryChange={handleCategoryChange}
            onAuthRequired={handleAuthRequired}
          />
        );
      case 'cart':
        return (
          <Cart
            onBack={() => setCurrentPage('home')}
            onCheckout={handleCheckout}
          />
        );
      case 'wishlist':
        return user ? (
          <Wishlist
            onBack={() => setCurrentPage('home')}
            onProductClick={handleProductClick}
          />
        ) : (
          <Home
            onProductClick={handleProductClick}
            onCategoryChange={handleCategoryChange}
            onAuthRequired={handleAuthRequired}
          />
        );
      case 'checkout':
        return user ? (
          <Checkout
            onBack={() => setCurrentPage('cart')}
            onOrderComplete={handleOrderComplete}
          />
        ) : (
          <Home
            onProductClick={handleProductClick}
            onCategoryChange={handleCategoryChange}
            onAuthRequired={handleAuthRequired}
          />
        );
      case 'about':
        return <About />;
      case 'policies':
      case 'privacy':
      case 'terms':
      case 'cookies':
        return <Policies currentSection={currentPage} />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <Home
            onProductClick={handleProductClick}
            onCategoryChange={handleCategoryChange}
            onAuthRequired={handleAuthRequired}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1a1a1a] relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#5D3A8D]/20 to-[#A67C9D]/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-[#A67C9D]/15 to-[#5D3A8D]/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-[#2C2A29]/10 to-[#5D3A8D]/15 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-[#A67C9D]/20 to-[#2C2A29]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-br from-[#5D3A8D]/15 to-[#A67C9D]/20 rounded-full blur-2xl"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/2 w-16 h-16 bg-[#5D3A8D]/10 rotate-45 blur-sm"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-[#A67C9D]/15 rotate-12 blur-sm"></div>
        <div className="absolute top-3/4 right-1/4 w-20 h-20 bg-[#2C2A29]/10 rotate-45 blur-md"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
          backgroundImage: `
            linear-gradient(90deg, #5D3A8D 1px, transparent 1px),
            linear-gradient(180deg, #5D3A8D 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Radial Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-[#5D3A8D]/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-[#A67C9D]/8 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onCategoryChange={handleCategoryChange}
          onCartAccess={handleCartAccess}
          onWishlistAccess={handleWishlistAccess}
          onAuthRequired={handleAuthRequired}
          onStylePreferences={() => setShowStyleModal(true)}
          onProductClick={handleProductClick}
        />
        <main>
          {renderCurrentPage()}
        </main>
        <Footer onPageChange={handlePageChange} />
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        context={authContext}
      />

      <StylePreferenceModal
        isOpen={showStyleModal}
        onClose={() => setShowStyleModal(false)}
      />

      <SuperuserAuth
        isOpen={showSuperuserAuth}
        onClose={() => setShowSuperuserAuth(false)}
        onSuccess={handleSuperuserSuccess}
      />

      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
      
      {orderCompleted && (
        <div className="fixed inset-0 bg-[#000000] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2C2A29] rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-[#A67C9D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#A67C9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2C2A29] dark:text-[#F5F5F5] mb-2">Order Successful!</h2>
            <p className="text-[#2C2A29]/70 dark:text-[#F5F5F5]/70 mb-6">
              Thank you for your purchase. You'll receive a confirmation email shortly.
            </p>
            <button
              onClick={() => setOrderCompleted(false)}
              className="bg-[#5D3A8D] text-white px-6 py-2 rounded-lg font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Admin Access Hint */}
      <div className="fixed bottom-4 right-4 text-xs text-[#2C2A29]/40 dark:text-[#F5F5F5]/40 bg-[#F5F5F5] dark:bg-[#2C2A29] px-2 py-1 rounded opacity-50">
        Press Ctrl+Shift+A for Admin Panel
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
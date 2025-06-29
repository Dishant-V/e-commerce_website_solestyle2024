import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, TrendingDown } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface WishlistProps {
  onBack: () => void;
  onProductClick: (product: any) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onBack, onProductClick }) => {
  const { items, removeFromWishlist, priceDropItems, markPriceDropNotified } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart(item.product, item.product.sizes[0], item.product.colors[0]);
  };

  const handlePriceDropDismiss = (productId: string) => {
    markPriceDropNotified(productId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save items you love for later!</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <div className="w-32"></div>
        </div>

        {/* Price Drop Notifications */}
        {priceDropItems.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <TrendingDown className="text-green-600 mr-2" size={24} />
              <h2 className="text-lg font-semibold text-green-800">
                Price Drop Alert! 🎉
              </h2>
            </div>
            <div className="space-y-3">
              {priceDropItems.map(item => (
                <div key={item.product.id} className="flex items-center justify-between bg-white p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600">
                          ${item.product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          Save ${(item.originalPrice - item.product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handlePriceDropDismiss(item.product.id)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const hasPriceDrop = item.product.price < item.originalPrice;
            return (
              <div key={item.product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group">
                <div className="relative">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => onProductClick(item.product)}
                  />
                  {hasPriceDrop && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Price Drop!
                    </div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 
                    className="font-semibold text-lg text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => onProductClick(item.product)}
                  >
                    {item.product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${item.product.price}
                      </span>
                      {hasPriceDrop && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {item.product.colors.slice(0, 3).map(color => (
                        <div
                          key={color}
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    Added {item.addedAt.toLocaleDateString()}
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
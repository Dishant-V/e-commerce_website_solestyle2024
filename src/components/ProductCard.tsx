import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import Product360View from './Product360View';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAuthRequired?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onAuthRequired }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [show360View, setShow360View] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
    
    // Show confirmation
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onAuthRequired?.();
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handle360View = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShow360View(true);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const inWishlist = user && isInWishlist(product.id);

  return (
    <>
      <div 
        onClick={() => onProductClick(product)}
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group relative"
      >
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-[#A67C9D] text-white px-2 py-1 rounded-full text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}
          
          {/* 360° View Button */}
          <button 
            onClick={handle360View}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#2C2A29]/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100"
            title="360° View"
          >
            <RotateCcw size={16} />
          </button>

          <button 
            onClick={handleWishlistToggle}
            className={`absolute top-4 right-4 p-2 rounded-full shadow-md ${
              inWishlist 
                ? 'bg-[#A67C9D] text-white' 
                : 'bg-white text-[#2C2A29]'
            }`}
          >
            <Heart size={20} className={inWishlist ? 'fill-current' : ''} />
          </button>
          <div className="absolute inset-0 bg-[#2C2A29] bg-opacity-0 group-hover:bg-opacity-10" />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-[#2C2A29] mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(product.rating) ? 'text-[#A67C9D] fill-current' : 'text-[#F5F5F5]'}
                />
              ))}
            </div>
            <span className="text-sm text-[#2C2A29]/60 ml-2">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#2C2A29]">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#2C2A29]/50 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map(color => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border-2 border-[#F5F5F5]"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-[#2C2A29]/50 ml-1">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
              showAddedToCart 
                ? 'bg-[#A67C9D] text-white' 
                : 'bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] text-white'
            }`}
          >
            <ShoppingCart size={18} />
            <span>{showAddedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
          </button>
        </div>

        {/* Added to Cart Notification */}
        {showAddedToCart && (
          <div className="absolute inset-0 bg-[#A67C9D] bg-opacity-90 flex items-center justify-center rounded-xl">
            <div className="text-white text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <ShoppingCart size={24} />
              </div>
              <p className="font-semibold">Added to Cart!</p>
            </div>
          </div>
        )}
      </div>

      <Product360View
        isOpen={show360View}
        onClose={() => setShow360View(false)}
        productName={product.name}
        baseImageUrl={product.image}
      />
    </>
  );
};

export default ProductCard;
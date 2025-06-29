import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, ArrowLeft, Truck, Shield, RotateCcw, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import Product360View from './Product360View';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAuthRequired: () => void;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  images?: string[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAuthRequired }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [show360View, setShow360View] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Sarah M.',
      rating: 5,
      date: '2024-01-15',
      title: 'Perfect fit and amazing quality!',
      comment: 'I absolutely love these shoes! The quality is outstanding and they fit perfectly. Very comfortable for all-day wear. The color is exactly as shown in the pictures. Highly recommend!',
      verified: true,
      helpful: 24,
      notHelpful: 2,
      images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300']
    },
    {
      id: '2',
      userName: 'Mike R.',
      rating: 4,
      date: '2024-01-10',
      title: 'Great shoes, fast delivery',
      comment: 'Really happy with this purchase. The shoes are well-made and comfortable. Only minor issue is they run slightly small, so I\'d recommend ordering half a size up.',
      verified: true,
      helpful: 18,
      notHelpful: 1
    },
    {
      id: '3',
      userName: 'Emma L.',
      rating: 5,
      date: '2024-01-08',
      title: 'Exceeded expectations!',
      comment: 'These shoes are even better than I expected. The craftsmanship is excellent and they\'re incredibly comfortable. I\'ve gotten so many compliments!',
      verified: true,
      helpful: 31,
      notHelpful: 0
    },
    {
      id: '4',
      userName: 'David K.',
      rating: 3,
      date: '2024-01-05',
      title: 'Good but not great',
      comment: 'The shoes are decent quality but not as comfortable as I hoped. They look nice but after wearing them for a few hours, my feet start to hurt.',
      verified: true,
      helpful: 8,
      notHelpful: 5
    },
    {
      id: '5',
      userName: 'Lisa T.',
      rating: 5,
      date: '2024-01-02',
      title: 'Love them!',
      comment: 'Perfect shoes for work and casual wear. Very versatile and the quality is top-notch. Will definitely buy more from this brand.',
      verified: true,
      helpful: 15,
      notHelpful: 1
    }
  ];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    
    // Show confirmation
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const inWishlist = user && isInWishlist(product.id);

  const filteredReviews = reviewFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(reviewFilter));

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <>
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#5D3A8D] mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Image */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                  {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-[#A67C9D] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{discountPercentage}% OFF
                    </div>
                  )}
                  
                  {/* 360° View Button */}
                  <button 
                    onClick={() => setShow360View(true)}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#2C2A29]/70 text-white px-4 py-2 rounded-full flex items-center space-x-2"
                  >
                    <RotateCcw size={18} />
                    <span>360° View</span>
                  </button>

                  <button 
                    onClick={handleWishlistToggle}
                    className={`absolute top-4 right-4 p-3 rounded-full shadow-md ${
                      inWishlist 
                        ? 'bg-[#A67C9D] text-white' 
                        : 'bg-white text-[#2C2A29]'
                    }`}
                  >
                    <Heart size={24} className={inWishlist ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8 relative">
                <h1 className="text-3xl font-bold text-[#2C2A29] mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(product.rating) ? 'text-[#A67C9D] fill-current' : 'text-[#F5F5F5]'}
                      />
                    ))}
                  </div>
                  <span className="text-[#2C2A29]/60 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-[#2C2A29]">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-[#2C2A29]/50 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                <p className="text-[#2C2A29]/70 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#2C2A29] mb-2">
                    Size
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 border rounded-lg text-center ${
                          selectedSize === size
                            ? 'border-[#5D3A8D] bg-[#5D3A8D]/10 text-[#5D3A8D]'
                            : 'border-[#F5F5F5]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#2C2A29] mb-2">
                    Color
                  </label>
                  <div className="flex space-x-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color
                            ? 'border-[#5D3A8D] ring-2 ring-[#5D3A8D]/20'
                            : 'border-[#F5F5F5]'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#2C2A29] mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-[#F5F5F5] rounded-lg flex items-center justify-center bg-[#F5F5F5]"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-[#F5F5F5] rounded-lg flex items-center justify-center bg-[#F5F5F5]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 mb-6 ${
                    showAddedToCart 
                      ? 'bg-[#A67C9D] text-white' 
                      : 'bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] text-white'
                  }`}
                >
                  <ShoppingCart size={20} />
                  <span>{showAddedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#F5F5F5]">
                  <div className="flex items-center space-x-2">
                    <Truck className="text-[#5D3A8D]" size={20} />
                    <span className="text-sm text-[#2C2A29]/60">Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="text-[#A67C9D]" size={20} />
                    <span className="text-sm text-[#2C2A29]/60">Quality Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="text-[#5D3A8D]" size={20} />
                    <span className="text-sm text-[#2C2A29]/60">Easy Returns</span>
                  </div>
                </div>

                {/* Added to Cart Notification Overlay */}
                {showAddedToCart && (
                  <div className="absolute inset-0 bg-[#A67C9D] bg-opacity-90 flex items-center justify-center rounded-xl">
                    <div className="text-white text-center">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart size={32} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Added to Cart!</h3>
                      <p className="text-lg">
                        {quantity} × {product.name}
                      </p>
                      <p className="text-sm mt-2 opacity-90">
                        Size: {selectedSize} | Color: {selectedColor}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#2C2A29] mb-6">Customer Reviews</h2>
                
                {/* Rating Summary */}
                <div className="mb-6 p-4 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-3xl font-bold text-[#2C2A29] mr-2">
                          {averageRating.toFixed(1)}
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={i < Math.floor(averageRating) ? 'text-[#A67C9D] fill-current' : 'text-[#F5F5F5]'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#2C2A29]/60">{reviews.length} reviews</p>
                    </div>
                  </div>
                  
                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <span className="text-sm w-8">{rating}★</span>
                        <div className="flex-1 bg-[#F5F5F5] rounded-full h-2">
                          <div 
                            className="bg-[#A67C9D] h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#2C2A29]/60 w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['all', '5', '4', '3', '2', '1'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setReviewFilter(filter as any)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reviewFilter === filter
                          ? 'bg-[#5D3A8D] text-white'
                          : 'bg-[#F5F5F5] text-[#2C2A29]/60'
                      }`}
                    >
                      {filter === 'all' ? 'All' : `${filter} Stars`}
                    </button>
                  ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {filteredReviews.map(review => (
                    <div key={review.id} className="border-b border-[#F5F5F5] pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#5D3A8D] rounded-full flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-[#2C2A29]">{review.userName}</h4>
                              {review.verified && (
                                <span className="bg-[#A67C9D]/10 text-[#A67C9D] text-xs px-2 py-1 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < review.rating ? 'text-[#A67C9D] fill-current' : 'text-[#F5F5F5]'}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-[#2C2A29]/50">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h5 className="font-semibold text-[#2C2A29] mb-2">{review.title}</h5>
                      <p className="text-[#2C2A29]/70 text-sm mb-3 leading-relaxed">{review.comment}</p>
                      
                      {review.images && (
                        <div className="flex space-x-2 mb-3">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt="Review"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="flex items-center space-x-1 text-[#2C2A29]/50">
                          <ThumbsUp size={14} />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                        <button className="flex items-center space-x-1 text-[#2C2A29]/50">
                          <ThumbsDown size={14} />
                          <span>Not helpful ({review.notHelpful})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Write Review Button */}
                <button
                  onClick={() => user ? null : onAuthRequired()}
                  className="w-full mt-6 bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] text-white py-3 px-6 rounded-lg font-semibold"
                >
                  {user ? 'Write a Review' : 'Sign in to Write a Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default ProductDetail;
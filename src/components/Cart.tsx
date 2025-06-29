import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  onBack: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onBack, onCheckout }) => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-[#2C2A29]/40 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C2A29] mb-2">Your cart is empty</h2>
          <p className="text-[#2C2A29]/60 mb-6">Add some shoes to get started!</p>
          <button
            onClick={onBack}
            className="bg-[#5D3A8D] text-white px-6 py-3 rounded-lg font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#5D3A8D]"
          >
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl font-bold text-[#2C2A29]">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-[#A67C9D]"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-[#F5F5F5]">
            {items.map((item, index) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2C2A29] mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-[#2C2A29]/60 text-sm mb-2">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-lg font-bold text-[#2C2A29]">
                      ${item.product.price}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                      className="w-8 h-8 border border-[#F5F5F5] rounded-lg flex items-center justify-center bg-[#F5F5F5]"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                      className="w-8 h-8 border border-[#F5F5F5] rounded-lg flex items-center justify-center bg-[#F5F5F5]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#2C2A29] mb-2">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                      className="text-[#A67C9D]"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#F5F5F5] p-6 border-t border-[#F5F5F5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-[#2C2A29]">Total:</span>
              <span className="text-2xl font-bold text-[#2C2A29]">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] text-white py-4 px-6 rounded-lg font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
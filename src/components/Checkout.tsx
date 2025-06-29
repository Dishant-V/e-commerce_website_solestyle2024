import React, { useState } from 'react';
import { ArrowLeft, CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CheckoutProps {
  onBack: () => void;
  onOrderComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onOrderComplete }) => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate Razorpay payment integration
      const options = {
        key: 'YOUR_RAZORPAY_KEY_HERE', // Replace with actual Razorpay key
        amount: Math.round(total * 100), // Amount in paise
        currency: 'USD',
        name: 'SoleStyle',
        description: 'Shoe Purchase',
        order_id: `order_${Date.now()}`,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          clearCart();
          onOrderComplete();
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#5D3A8D'
        }
      };

      // In a real app, you would load Razorpay SDK and use it here
      // For demo purposes, we'll simulate the payment
      setTimeout(() => {
        clearCart();
        onOrderComplete();
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  const subtotal = total;
  const shipping = 0; // Free shipping
  const tax = total * 0.08; // 8% tax
  const finalTotal = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-[#5D3A8D] mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-3xl font-bold text-[#2C2A29] mb-8">Checkout</h1>

        {/* Sign in prompt for non-authenticated users */}
        {!user && (
          <div className="bg-[#5D3A8D]/10 border border-[#5D3A8D]/20 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#5D3A8D] mb-2">
                Sign in before checking out
              </h2>
              <p className="text-[#2C2A29]/70 mb-4">
                Please sign in to your account to complete your purchase and enjoy faster checkout, order tracking, and exclusive offers.
              </p>
              <button
                onClick={() => window.location.reload()} // This would trigger the auth modal in a real implementation
                className="bg-[#5D3A8D] text-white px-6 py-3 rounded-lg font-semibold"
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        )}

        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold text-[#2C2A29] mb-4 flex items-center">
                    <User className="mr-2" size={20} />
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-semibold text-[#2C2A29] mb-4 flex items-center">
                    <MapPin className="mr-2" size={20} />
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h2 className="text-xl font-semibold text-[#2C2A29] mb-4 flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2C2A29] mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full border border-[#F5F5F5] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] text-white py-4 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing Payment...' : `Pay $${finalTotal.toFixed(2)}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#2C2A29] mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-[#2C2A29]">{item.product.name}</h3>
                      <p className="text-sm text-[#2C2A29]/60">Size: {item.size} | Color: {item.color}</p>
                      <p className="text-sm text-[#2C2A29]/60">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-[#2C2A29]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#F5F5F5] pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#2C2A29]/60">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2C2A29]/60">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2C2A29]/60">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-[#F5F5F5] pt-2">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
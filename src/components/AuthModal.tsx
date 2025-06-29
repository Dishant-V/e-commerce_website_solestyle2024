import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  context?: 'checkout' | 'general';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, context = 'general' }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          setError('Please enter your full name');
          return;
        }
        await register(formData.name, formData.email, formData.password, formData.phone);
      }
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({ name: '', email: '', password: '', phone: '' });
    } catch (err) {
      if (err instanceof Error && err.message === 'NEW_USER') {
        setError('NEW_USER');
      } else {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', phone: '' });
  };

  // Get title and subtitle based on context
  const getTitle = () => {
    if (context === 'checkout') {
      return isLogin ? 'Sign in before ordering' : 'Create Account to Order';
    }
    return isLogin ? 'Welcome Back' : 'Join SoleStyle';
  };

  const getSubtitle = () => {
    if (context === 'checkout') {
      return isLogin ? 'Please sign in to complete your order' : 'Create your account to place your order';
    }
    return isLogin ? 'Sign in to your account' : 'Create your account and discover your style';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] px-6 py-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-[#F5F5F5]/80"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {getTitle()}
          </h2>
          <p className="text-[#F5F5F5]/90 mt-1">
            {getSubtitle()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && error !== 'NEW_USER' && (
            <div className="bg-[#A67C9D]/10 border border-[#A67C9D]/30 text-[#A67C9D] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {error === 'NEW_USER' && (
            <div className="bg-[#A67C9D]/10 border border-[#A67C9D]/30 text-[#A67C9D] px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[#A67C9D]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[#2C2A29]">
                    New User! Please sign up
                  </h3>
                  <p className="mt-1 text-sm text-[#2C2A29]/70">
                    This email is not registered. Please create an account to continue.
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleModeSwitch}
                  className="bg-[#A67C9D]/20 hover:bg-[#A67C9D]/30 text-[#2C2A29] px-3 py-1 rounded text-sm font-medium"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-[#2C2A29]/40" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-[#F5F5F5] rounded-lg focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-[#2C2A29]/40" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 border border-[#F5F5F5] rounded-lg focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
              required
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-[#2C2A29]/40" size={20} />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-[#F5F5F5] rounded-lg focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#2C2A29]/40" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-11 pr-12 py-3 border border-[#F5F5F5] rounded-lg focus:ring-2 focus:ring-[#5D3A8D] focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-[#2C2A29]/40 hover:text-[#2C2A29]/60"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#5D3A8D] to-[#A67C9D] text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleModeSwitch}
              className="text-[#5D3A8D] hover:text-[#A67C9D] font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {!isLogin && (
            <div className="bg-[#5D3A8D]/10 border border-[#5D3A8D]/20 rounded-lg p-4 mt-4">
              <p className="text-[#2C2A29] text-sm">
                <strong>Why join SoleStyle?</strong> Get personalized recommendations, 
                exclusive offers, order tracking, and a curated shopping experience 
                tailored to your style preferences.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
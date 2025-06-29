import React, { useState } from 'react';
import { X, Lock, User } from 'lucide-react';

interface SuperuserAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SuperuserAuth: React.FC<SuperuserAuthProps> = ({ isOpen, onClose, onSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Superuser credentials (in production, this would be handled securely on the backend)
  const SUPERUSER_CREDENTIALS = {
    username: 'admin',
    password: 'solestyle2024'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (
      credentials.username === SUPERUSER_CREDENTIALS.username &&
      credentials.password === SUPERUSER_CREDENTIALS.password
    ) {
      onSuccess();
      onClose();
      setCredentials({ username: '', password: '' });
    } else {
      setError('Invalid credentials. Access denied.');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <Lock className="text-white" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-white">Admin Access</h2>
              <p className="text-red-100 mt-1">Superuser authentication required</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <p className="text-gray-700 text-sm">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Username: <code className="bg-gray-200 px-1 rounded">admin</code><br />
              Password: <code className="bg-gray-200 px-1 rounded">solestyle2024</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperuserAuth;
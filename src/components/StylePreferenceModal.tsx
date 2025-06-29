import React, { useState } from 'react';
import { X, Crown, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface StylePreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StylePreferenceModal: React.FC<StylePreferenceModalProps> = ({ isOpen, onClose }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const { updateStylePreference } = useAuth();

  const styles = [
    {
      id: 'luxurious',
      name: 'Luxurious',
      description: 'Premium materials, elegant designs, and sophisticated craftsmanship',
      icon: Crown,
      gradient: 'from-purple-600 to-purple-800',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      features: ['Premium leather', 'Designer brands', 'Exclusive collections', 'Handcrafted details']
    },
    {
      id: 'funky',
      name: 'Funky',
      description: 'Bold colors, unique patterns, and statement-making designs',
      icon: Zap,
      gradient: 'from-orange-500 to-pink-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      features: ['Vibrant colors', 'Unique patterns', 'Limited editions', 'Street style']
    },
    {
      id: 'classy-cool',
      name: 'Classy Yet Cool',
      description: 'Modern sophistication with a contemporary edge',
      icon: Sparkles,
      gradient: 'from-blue-600 to-indigo-700',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      features: ['Modern designs', 'Versatile styles', 'Quality comfort', 'Timeless appeal']
    }
  ];

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleSavePreference = () => {
    if (selectedStyle) {
      updateStylePreference(selectedStyle);
      onClose();
    }
  };

  const handleSkip = () => {
    updateStylePreference('none');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">
            What's Your Style?
          </h2>
          <p className="text-blue-100">
            Help us personalize your shopping experience by choosing your preferred style
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {styles.map((style) => {
              const IconComponent = style.icon;
              return (
                <div
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedStyle === style.id
                      ? 'border-blue-500 shadow-lg ring-4 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className={`${style.bgColor} p-6 rounded-t-xl`}>
                    <div className="text-center">
                      <div className={`w-16 h-16 ${style.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <IconComponent className={style.iconColor} size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {style.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {style.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white rounded-b-xl">
                    <ul className="space-y-2">
                      {style.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedStyle === style.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={handleSavePreference}
              disabled={!selectedStyle}
              className={`px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                selectedStyle
                  ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:from-blue-700 hover:to-purple-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save My Style Preference
            </button>
            
            <div>
              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              <strong>Why choose a style?</strong> We'll curate personalized recommendations, 
              show you relevant products first, and send you updates about new arrivals 
              that match your taste.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylePreferenceModal;
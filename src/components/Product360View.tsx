import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface Product360ViewProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  baseImageUrl: string;
}

const Product360View: React.FC<Product360ViewProps> = ({ 
  isOpen, 
  onClose, 
  productName, 
  baseImageUrl 
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate 360-degree images (in a real app, you'd have actual 360° images)
  const totalFrames = 36; // 36 frames for 360° view (10° per frame)
  
  // Generate mock 360° images by using the same image with different filters/transforms
  const generateFrameUrl = (frame: number) => {
    // In a real app, you'd have actual 360° product images
    // For demo, we'll use the same image with different CSS transforms
    return baseImageUrl;
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastX;
    const sensitivity = 2; // Adjust sensitivity
    const frameChange = Math.floor(deltaX / sensitivity);

    if (frameChange !== 0) {
      setCurrentFrame(prev => {
        let newFrame = prev + frameChange;
        if (newFrame < 0) newFrame = totalFrames - 1;
        if (newFrame >= totalFrames) newFrame = 0;
        return newFrame;
      });
      setLastX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setLastX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - lastX;
    const sensitivity = 2;
    const frameChange = Math.floor(deltaX / sensitivity);

    if (frameChange !== 0) {
      setCurrentFrame(prev => {
        let newFrame = prev + frameChange;
        if (newFrame < 0) newFrame = totalFrames - 1;
        if (newFrame >= totalFrames) newFrame = 0;
        return newFrame;
      });
      setLastX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const autoRotate = () => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % totalFrames);
    }, 100);

    setTimeout(() => clearInterval(interval), 3600); // Rotate for 3.6 seconds (full rotation)
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white">360° Product View</h2>
          <p className="text-gray-300 mt-1">{productName}</p>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading 360° view...</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div
                ref={containerRef}
                className="relative mx-auto mb-6 cursor-grab active:cursor-grabbing select-none"
                style={{ width: '400px', height: '400px' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={generateFrameUrl(currentFrame)}
                  alt={`${productName} - Frame ${currentFrame}`}
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                  style={{
                    transform: `rotateY(${currentFrame * 10}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                  }}
                  draggable={false}
                />
                
                {/* 360° indicator */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  360°
                </div>

                {/* Frame indicator */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                  {Math.round((currentFrame / totalFrames) * 360)}°
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={autoRotate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw size={20} />
                    <span>Auto Rotate</span>
                  </button>
                </div>

                <div className="text-center text-gray-600">
                  <p className="text-sm mb-2">
                    <strong>Desktop:</strong> Click and drag to rotate • <strong>Mobile:</strong> Swipe to rotate
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Drag horizontally to spin the product</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${(currentFrame / totalFrames) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product360View;
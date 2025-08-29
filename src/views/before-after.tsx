import React, { useState, useRef, useCallback } from 'react';

const BeforeAfter: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50); // Default position at 50%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on slider
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for mouse move and mouse up
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle touch events for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add touch event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">So sánh Trước & Sau</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Xem sự khác biệt rõ rệt giữa ảnh trước và sau điều trị. 
            Kéo thanh trượt để so sánh và đánh giá hiệu quả điều trị.
          </p>
        </div>

        {/* Image Comparison Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            ref={containerRef}
            className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden cursor-ew-resize select-none"
          >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Sau điều trị"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                SAU
              </div>
            </div>

            {/* Before Image (Overlay with clip-path) */}
            <div 
              className="absolute inset-0"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Trước điều trị"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                TRƯỚC
              </div>
            </div>

            {/* Slider Line */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            />

            {/* Slider Handle */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 cursor-ew-resize z-20 flex items-center justify-center hover:bg-gray-50 transition-colors"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="w-1 h-4 bg-gray-400"></div>
              <div className="w-1 h-4 bg-gray-400 ml-0.5"></div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 bg-gray-50 text-center">
            <p className="text-gray-600">
              <span className="font-semibold">Hướng dẫn:</span> Kéo thanh trượt sang trái để xem ảnh "Sau", kéo sang phải để xem ảnh "Trước"
            </p>
            <div className="mt-4 flex justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Trước điều trị</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Sau điều trị</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default BeforeAfter;
import React, { useState, useRef, useCallback } from 'react';
import { useCheckProcessController } from '../controllers/useCheckProcessController';
import { Upload, Camera, History, Trash2, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

const BeforeAfter: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstImageInputRef = useRef<HTMLInputElement>(null);
  const secondImageInputRef = useRef<HTMLInputElement>(null);

  const {
    state,
    sliderPosition,
    setSliderPosition,
    createCheckProcess,
    trackCheckProcess,
    resetProcess,
    loadHistoryItem,
    removeHistoryItem,
    clearHistory,
    clearError,
    isStep1Complete,
    isStep2Complete,
    canShowComparison,
    hasHistory
  } = useCheckProcessController();

  // Handle file selection for first image
  const handleFirstImageUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }

    try {
      await createCheckProcess(file);
    } catch (error) {
      console.error('Error uploading first image:', error);
    }
  }, [createCheckProcess]);

  // Handle file selection for second image
  const handleSecondImageUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }

    try {
      await trackCheckProcess(file);
    } catch (error) {
      console.error('Error uploading second image:', error);
    }
  }, [trackCheckProcess]);

  // Handle file input changes
  const handleFirstImageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFirstImageUpload(file);
    }
  }, [handleFirstImageUpload]);

  const handleSecondImageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSecondImageUpload(file);
    }
  }, [handleSecondImageUpload]);
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
            Tải lên ảnh trước và sau điều trị để so sánh sự khác biệt. 
            Hệ thống sẽ giúp bạn theo dõi quá trình điều trị một cách trực quan.
          </p>
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{state.error}</span>
            <button 
              onClick={clearError}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <History className="h-4 w-4 mr-2" />
              Lịch sử ({state.history.length})
            </button>
            {(isStep1Complete || isStep2Complete) && (
              <button
                onClick={resetProcess}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Bắt đầu lại
              </button>
            )}
          </div>
        </div>

        {/* History Section */}
        {showHistory && (
          <div className="max-w-4xl mx-auto mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Lịch sử so sánh</h3>
                {hasHistory && (
                  <button
                    onClick={clearHistory}
                    className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa tất cả
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              {hasHistory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {state.history.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex space-x-2 mb-3">
                        <img 
                          src={item.firstImage} 
                          alt="Trước" 
                          className="w-20 h-20 object-cover rounded"
                        />
                        <img 
                          src={item.latestImage} 
                          alt="Sau" 
                          className="w-20 h-20 object-cover rounded"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            loadHistoryItem(item);
                            setShowHistory(false);
                          }}
                          className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          Xem
                        </button>
                        <button
                          onClick={() => removeHistoryItem(item.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Chưa có lịch sử so sánh nào</p>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Step Indicator */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center justify-center space-x-8">
              <div className={`flex items-center ${isStep1Complete ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isStep1Complete ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {isStep1Complete ? <CheckCircle className="h-5 w-5" /> : '1'}
                </div>
                <span className="font-medium">Tải ảnh đầu tiên</span>
              </div>
              <div className={`w-16 h-1 ${isStep1Complete ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${isStep2Complete ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isStep2Complete ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {isStep2Complete ? <CheckCircle className="h-5 w-5" /> : '2'}
                </div>
                <span className="font-medium">Tải ảnh thứ hai</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {!canShowComparison ? (
            <div className="p-8">
              {/* Step 1: Upload First Image */}
              {!isStep1Complete && (
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Bước 1: Tải ảnh đầu tiên</h3>
                  <p className="text-gray-600 mb-8">Tải lên ảnh trước điều trị hoặc ảnh cần theo dõi</p>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => firstImageInputRef.current?.click()}
                  >
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-700 mb-2">Chọn ảnh đầu tiên</p>
                    <p className="text-gray-500">Nhấn để chọn file hoặc kéo thả ảnh vào đây</p>
                  </div>

                  <input
                    ref={firstImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFirstImageInputChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Step 2: Upload Second Image */}
              {isStep1Complete && !isStep2Complete && (
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Bước 2: Tải ảnh thứ hai</h3>
                  <p className="text-gray-600 mb-8">Tải lên ảnh sau điều trị để so sánh</p>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => secondImageInputRef.current?.click()}
                  >
                    <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-700 mb-2">Chọn ảnh thứ hai</p>
                    <p className="text-gray-500">Nhấn để chọn file hoặc kéo thả ảnh vào đây</p>
                  </div>

                  <input
                    ref={secondImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSecondImageInputChange}
                    className="hidden"
                  />

                  {state.currentProcess && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800">✅ Ảnh đầu tiên đã được tải lên thành công!</p>
                      <p className="text-blue-600 text-sm">ID quá trình: {state.currentProcess.id}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Loading State */}
              {state.isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang xử lý ảnh...</p>
                </div>
              )}
            </div>
          ) : (
            /* Image Comparison Container */
            <div 
              ref={containerRef}
              className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden cursor-ew-resize select-none"
            >
              {/* After Image (Background) */}
              <div className="absolute inset-0">
                <img 
                  src={state.comparison?.latest_image}
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
                  src={state.comparison?.first_image}
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
          )}

          {/* Instructions */}
          {canShowComparison && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfter;
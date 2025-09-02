import React from 'react';
import { Search, BookOpen, AlertCircle, Loader2, Pill, Shield, Stethoscope, MapPin, Bug, Target, Microscope, Heart } from 'lucide-react';
import { useDiseaseKnowledgeController } from '../controllers/useDiseaseKnowledgeController';
import { DiseaseInfo } from '../models/disease';

/**
 * Disease Knowledge Lookup Page
 * Allows users to search for disease information using the API
 */
export default function DiseaseKnowledge() {
  const {
    searchQuery,
    diseaseInfo,
    loading,
    error,
    hasSearched,
    setSearchQuery,
    handleSearch,
    clearSearch
  } = useDiseaseKnowledgeController();

  /**
   * Render disease information card
   */
  const renderDiseaseInfo = (disease: DiseaseInfo, index: number) => (
    <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#145566] to-[#1e6b7a] text-white p-6">
        <h2 className="text-2xl font-bold mb-2">{disease["Tên bệnh"]}</h2>
        <p className="text-blue-100 flex items-center">
          <Microscope className="w-4 h-4 mr-2" />
          {disease["Tên khoa học"]}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Symptoms */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Triệu chứng
          </h3>
          <p className="text-gray-700 leading-relaxed bg-red-50 p-4 rounded-lg border-l-4 border-red-200">
            {disease["Triệu chứng"]}
          </p>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <MapPin className="w-5 h-5 mr-2 text-orange-500" />
            Vị trí xuất hiện
          </h3>
          <p className="text-gray-700 leading-relaxed bg-orange-50 p-4 rounded-lg border-l-4 border-orange-200">
            {disease["Vị trí xuất hiện"]}
          </p>
        </div>

        {/* Causes */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Bug className="w-5 h-5 mr-2 text-purple-500" />
            Nguyên nhân
          </h3>
          <p className="text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-lg border-l-4 border-purple-200">
            {disease["Nguyên nhân"]}
          </p>
        </div>

        {/* Diagnostic Criteria */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Tiêu chí chẩn đoán
          </h3>
          <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
            {disease["Tiêu chí chẩn đoán"]}
          </p>
        </div>

        {/* Differential Diagnosis */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Stethoscope className="w-5 h-5 mr-2 text-indigo-500" />
            Chẩn đoán phân biệt
          </h3>
          <p className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-200">
            {disease["Chẩn đoán phân biệt"]}
          </p>
        </div>

        {/* Treatment */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Heart className="w-5 h-5 mr-2 text-green-500" />
            Điều trị
          </h3>
          <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-200">
            {disease["Điều trị"]}
          </p>
        </div>

        {/* Prevention */}
        <div className="space-y-3">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">
            <Shield className="w-5 h-5 mr-2 text-teal-500" />
            Phòng bệnh
          </h3>
          <p className="text-gray-700 leading-relaxed bg-teal-50 p-4 rounded-lg border-l-4 border-teal-200">
            {disease["Phòng bệnh"]}
          </p>
        </div>

        {/* Medications */}
        {disease["Các loại thuốc"] && disease["Các loại thuốc"].length > 0 && (
          <div className="space-y-3">
            <h3 className="flex items-center text-lg font-semibold text-gray-800">
              <Pill className="w-5 h-5 mr-2 text-pink-500" />
              Các loại thuốc
            </h3>
            <div className="space-y-3">
              {disease["Các loại thuốc"].map((medication, medIndex) => (
                <div key={medIndex} className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-800 mb-2">{medication["Tên thuốc"]}</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Liều lượng:</span> {medication["Liều lượng"]}</p>
                    <p><span className="font-medium">Thời gian sử dụng:</span> {medication["Thời gian sử dụng"]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#145566] mb-2">Tra cứu thông tin bệnh</h1>
            <p className="text-gray-600">Tìm kiếm thông tin chi tiết về các bệnh da liễu</p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên bệnh cần tìm kiếm (ví dụ: mụn cóc, viêm da, nấm da...)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#145566] focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="flex-1 bg-[#145566] text-white px-6 py-3 rounded-lg hover:bg-[#0f3f44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tìm kiếm...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Tìm kiếm
                    </>
                  )}
                </button>
                
                {hasSearched && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Làm mới
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* No Results */}
          {hasSearched && !loading && !error && diseaseInfo.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500">
                Không tìm thấy thông tin về bệnh "{searchQuery}". Vui lòng thử với tên bệnh khác.
              </p>
            </div>
          )}

          {/* Results */}
          {diseaseInfo.length > 0 && (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-gray-600">
                  Tìm thấy {diseaseInfo.length} kết quả cho "{searchQuery}"
                </p>
              </div>
              
              {diseaseInfo.map((disease, index) => renderDiseaseInfo(disease, index))}
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <BookOpen className="w-16 h-16 text-[#145566] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Bắt đầu tìm kiếm</h3>
              <p className="text-gray-500 mb-4">
                Nhập tên bệnh vào ô tìm kiếm để tra cứu thông tin chi tiết
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {['Mụn cóc', 'Viêm da', 'Nấm da', 'Dị ứng'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchQuery(example)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
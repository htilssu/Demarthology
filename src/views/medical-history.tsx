import React, { useEffect } from 'react';
import { Heart, Pill, AlertTriangle, Activity, Users, Calendar, FileText, Plus, Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import useMedicalHistoryController from "../controllers/useMedicalHistoryController";

export default function MedicalHistory() {
   const { medicalHistory, loadMedicalHistory } =  useMedicalHistoryController();

   useEffect(() => {
       loadMedicalHistory();
   }, [loadMedicalHistory]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#145566]">Lịch sử bệnh án</h1>
                            <p className="text-gray-600 mt-1">Quản lý thông tin sức khỏe và lịch sử điều trị</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                to="/before-after"
                                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Images size={16} />
                                <span>So sánh Trước & Sau</span>
                            </Link>
                            <button className="flex items-center space-x-2 bg-[#145566] text-white px-4 py-2 rounded-lg hover:bg-[#0f3f44] transition-colors">
                                <Plus size={16} />
                                <span>Thêm bệnh án</span>
                            </button>
                        </div>
                    </div>

                    {medicalHistory.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có bệnh án nào</h3>
                            <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm thông tin sức khỏe của bạn</p>
                            <button 
                                onClick={loadMedicalHistory}
                                className="bg-[#145566] text-white px-6 py-3 rounded-lg hover:bg-[#0f3f44] transition-colors"
                            >
                                Tải dữ liệu mẫu
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {medicalHistory.map((record) => (
                                <div key={record.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    {/* Header của bệnh án */}
                                    <div className="bg-gradient-to-r from-[#145566] to-[#145569] text-white p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                {/*TODO: sua thanh ten benh*/}
                                                <h3 className="text-lg font-semibold">{record.name}</h3>
                                                <p className="text-sm opacity-90">
                                                    Cập nhật lần cuối: {formatDate(record.lastUpdated)}
                                                </p>
                                            </div>
                                            <Calendar className="text-white opacity-75" size={24} />
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Tình trạng sức khỏe */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-semibold text-gray-800">
                                                    <Heart className="mr-2 text-red-500" size={18} />
                                                    Tình trạng sức khỏe
                                                </h4>
                                                {record.conditions.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {record.conditions.map((condition, index) => (
                                                            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                                <span className="text-red-700 font-medium">{condition}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">Không có tình trạng đặc biệt</p>
                                                )}
                                            </div>

                                            {/* Thuốc đang sử dụng */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-semibold text-gray-800">
                                                    <Pill className="mr-2 text-blue-500" size={18} />
                                                    Thuốc đang sử dụng
                                                </h4>
                                                {record.medications.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {record.medications.map((medication, index) => (
                                                            <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                                <span className="text-blue-700 font-medium">{medication}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">Không có thuốc đang sử dụng</p>
                                                )}
                                            </div>

                                            {/* Dị ứng */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-semibold text-gray-800">
                                                    <AlertTriangle className="mr-2 text-yellow-500" size={18} />
                                                    Dị ứng
                                                </h4>
                                                {record.allergies.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {record.allergies.map((allergy, index) => (
                                                            <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                                <span className="text-yellow-700 font-medium">{allergy}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">Không có dị ứng</p>
                                                )}
                                            </div>

                                            {/* Phẫu thuật */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-semibold text-gray-800">
                                                    <Activity className="mr-2 text-purple-500" size={18} />
                                                    Phẫu thuật
                                                </h4>
                                                {record.surgeries.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {record.surgeries.map((surgery, index) => (
                                                            <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                                                <span className="text-purple-700 font-medium">{surgery}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">Không có phẫu thuật</p>
                                                )}
                                            </div>

                                            {/* Tiền sử gia đình */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-semibold text-gray-800">
                                                    <Users className="mr-2 text-green-500" size={18} />
                                                    Tiền sử gia đình
                                                </h4>
                                                {record.familyHistory.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {record.familyHistory.map((history, index) => (
                                                            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                                <span className="text-green-700 font-medium">{history}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">Không có tiền sử gia đình</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
                                            <button className="bg-[#145566] text-white px-4 py-2 rounded-lg hover:bg-[#0f3f44] transition-colors">
                                                Chỉnh sửa
                                            </button>
                                            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                Xuất PDF
                                            </button>
                                            <Link 
                                                to="/before-after"
                                                className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Images size={14} />
                                                <span>So sánh Trước & Sau</span>
                                            </Link>
                                            <button className="text-red-600 hover:text-red-700 px-4 py-2 transition-colors">
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Summary Statistics */}
                    {medicalHistory.length > 0 && (
                        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-[#145566] mb-4">Tổng quan</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">
                                        {medicalHistory.reduce((acc, record) => acc + record.conditions.length, 0)}
                                    </div>
                                    <div className="text-sm text-red-700">Tình trạng</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {medicalHistory.reduce((acc, record) => acc + record.medications.length, 0)}
                                    </div>
                                    <div className="text-sm text-blue-700">Thuốc</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {medicalHistory.reduce((acc, record) => acc + record.allergies.length, 0)}
                                    </div>
                                    <div className="text-sm text-yellow-700">Dị ứng</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {medicalHistory.reduce((acc, record) => acc + record.familyHistory.length, 0)}
                                    </div>
                                    <div className="text-sm text-green-700">Tiền sử gia đình</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { Edit3, Save, X, Heart, Pill, AlertTriangle, Activity, Users, FileText } from 'lucide-react';
import useProfileController from '../controllers/useProfileController';
import useMedicalHistoryController from '../controllers/useMedicalHistoryController';

function Profile() {
    const { 
        profile, 
        isEditing, 
        editForm, 
        startEdit, 
        cancelEdit, 
        saveProfile, 
        updateEditForm 
    } = useProfileController();

    const { medicalHistory, loadMedicalHistory } = useMedicalHistoryController();
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

    useEffect(() => {
        loadMedicalHistory();
    }, [loadMedicalHistory]);

    const toggleRecordSelection = (recordId: string) => {
        setSelectedRecords(prev => {
            if (prev.includes(recordId)) {
                return prev.filter(id => id !== recordId);
            } else {
                return [...prev, recordId];
            }
        });
    };

    const getSelectedRecordsInOrder = () => {
        return medicalHistory.filter(record => selectedRecords.includes(record.id));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-[#145566]">Hồ sơ bệnh án</h1>
                        <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và lịch sử sức khỏe</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left Sidebar - Medical Records Navigation */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="bg-gradient-to-r from-[#145566] to-[#145569] text-white p-4">
                                    <h2 className="font-semibold">Danh sách bệnh án</h2>
                                    <p className="text-xs text-gray-200 mt-1">Chọn nhiều bệnh án để xem</p>
                                </div>
                                
                                <div className="p-4">
                                    {medicalHistory.length === 0 ? (
                                        <div className="text-center py-4">
                                            <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-500 text-sm mb-3">Chưa có bệnh án</p>
                                            <button 
                                                onClick={loadMedicalHistory}
                                                className="bg-[#145566] text-white text-xs px-3 py-2 rounded hover:bg-[#0f3f44] transition-colors"
                                            >
                                                Tải dữ liệu mẫu
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {medicalHistory.map((record) => (
                                                <button
                                                    key={record.id}
                                                    onClick={() => toggleRecordSelection(record.id)}
                                                    className={`w-full text-left p-3 rounded-lg border transition-colors relative ${
                                                        selectedRecords.includes(record.id)
                                                            ? 'bg-[#145566] text-white border-[#145566]'
                                                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm">Bệnh án #{record.id}</div>
                                                            <div className={`text-xs mt-1 ${
                                                                selectedRecords.includes(record.id) ? 'text-gray-200' : 'text-gray-500'
                                                            }`}>
                                                                {formatDate(record.lastUpdated)}
                                                            </div>
                                                        </div>
                                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                                            selectedRecords.includes(record.id)
                                                                ? 'bg-white border-white'
                                                                : 'bg-transparent border-gray-400'
                                                        }`}>
                                                            {selectedRecords.includes(record.id) && (
                                                                <div className="w-2 h-2 bg-[#145566] rounded-sm"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Profile and Selected Medical Record */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Patient Profile Header */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                {/* Medical Form Header */}
                                <div className="bg-gradient-to-r from-[#145566] to-[#145569] text-white p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold">HỒ SƠ BỆNH NHÂN</h2>
                                            <p className="text-sm opacity-90">Medical Patient Profile</p>
                                        </div>
                                        <div className="text-right text-sm">
                                            <div>Ngày khám: {formatDate(new Date().toISOString())}</div>
                                            <div>STT: #{profile.id}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Patient Information */}
                                <div className="p-6 bg-white border-l-4 border-[#145566]">
                                    <div className="flex items-start space-x-6">
                                        <div className="relative">
                                            <img
                                                src={profile.avatarUrl || '/avatar.webp'}
                                                alt="Patient Avatar"
                                                className="w-24 h-24 rounded-lg border-2 border-gray-300 object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {/* Left Column */}
                                                <div className="space-y-3">
                                                    <div className="border-b border-gray-200 pb-2">
                                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Họ và tên bệnh nhân</label>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                value={editForm.name}
                                                                onChange={(e) => updateEditForm('name', e.target.value)}
                                                                className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#145566]"
                                                            />
                                                        ) : (
                                                            <div className="mt-1 font-semibold text-gray-900">{profile.name}</div>
                                                        )}
                                                    </div>

                                                    <div className="border-b border-gray-200 pb-2">
                                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ngày sinh</label>
                                                        {isEditing ? (
                                                            <input
                                                                type="date"
                                                                value={editForm.dob}
                                                                onChange={(e) => updateEditForm('dob', e.target.value)}
                                                                className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#145566]"
                                                            />
                                                        ) : (
                                                            <div className="mt-1 text-gray-900">{formatDate(profile.dob)}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right Column */}
                                                <div className="space-y-3">
                                                    <div className="border-b border-gray-200 pb-2">
                                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email liên hệ</label>
                                                        {isEditing ? (
                                                            <input
                                                                type="email"
                                                                value={editForm.email}
                                                                onChange={(e) => updateEditForm('email', e.target.value)}
                                                                className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#145566]"
                                                            />
                                                        ) : (
                                                            <div className="mt-1 text-gray-900">{profile.email}</div>
                                                        )}
                                                    </div>

                                                    <div className="border-b border-gray-200 pb-2">
                                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Địa chỉ</label>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                value={editForm.location || ''}
                                                                onChange={(e) => updateEditForm('location', e.target.value)}
                                                                className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#145566]"
                                                                placeholder="Nhập địa chỉ"
                                                            />
                                                        ) : (
                                                            <div className="mt-1 text-gray-900">{profile.location || 'Chưa cập nhật'}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-4 flex space-x-3">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={saveProfile}
                                                            className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors"
                                                        >
                                                            <Save size={14} />
                                                            <span>Lưu</span>
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-600 transition-colors"
                                                        >
                                                            <X size={14} />
                                                            <span>Hủy</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={startEdit}
                                                        className="flex items-center space-x-1 bg-[#145566] text-white px-3 py-1.5 rounded text-sm hover:bg-[#0f3f44] transition-colors"
                                                    >
                                                        <Edit3 size={14} />
                                                        <span>Chỉnh sửa</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Medical Records */}
                            {getSelectedRecordsInOrder().map((selectedRecord) => (
                                <div key={selectedRecord.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                    {/* Medical Record Header */}
                                    <div className="bg-gradient-to-r from-[#145566] to-[#145569] text-white p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold">BỆNH ÁN #{selectedRecord.id}</h3>
                                                <p className="text-sm opacity-90">Medical Record Details</p>
                                            </div>
                                            <div className="text-right text-sm">
                                                <div>Ngày cập nhật: {formatDate(selectedRecord.lastUpdated)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Medical Record Content */}
                                    <div className="p-6 bg-white border-l-4 border-[#145566]">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Health Conditions */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-bold text-gray-800 text-sm uppercase tracking-wide">
                                                    <Heart className="mr-2 text-red-500" size={16} />
                                                    Tình trạng sức khỏe
                                                </h4>
                                                <div className="border border-red-200 rounded-lg p-3 bg-red-50">
                                                    {selectedRecord.conditions.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {selectedRecord.conditions.map((condition, index) => (
                                                                <div key={index} className="text-red-700 text-sm font-medium border-b border-red-200 pb-1 last:border-b-0 last:pb-0">
                                                                    • {condition}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm italic">Không có tình trạng đặc biệt</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Medications */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-bold text-gray-800 text-sm uppercase tracking-wide">
                                                    <Pill className="mr-2 text-blue-500" size={16} />
                                                    Thuốc đang sử dụng
                                                </h4>
                                                <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                                                    {selectedRecord.medications.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {selectedRecord.medications.map((medication, index) => (
                                                                <div key={index} className="text-blue-700 text-sm font-medium border-b border-blue-200 pb-1 last:border-b-0 last:pb-0">
                                                                    • {medication}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm italic">Không có thuốc đang sử dụng</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Allergies */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-bold text-gray-800 text-sm uppercase tracking-wide">
                                                    <AlertTriangle className="mr-2 text-yellow-500" size={16} />
                                                    Dị ứng
                                                </h4>
                                                <div className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                                                    {selectedRecord.allergies.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {selectedRecord.allergies.map((allergy, index) => (
                                                                <div key={index} className="text-yellow-700 text-sm font-medium border-b border-yellow-200 pb-1 last:border-b-0 last:pb-0">
                                                                    • {allergy}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm italic">Không có dị ứng</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Surgeries */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-bold text-gray-800 text-sm uppercase tracking-wide">
                                                    <Activity className="mr-2 text-purple-500" size={16} />
                                                    Phẫu thuật
                                                </h4>
                                                <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                                                    {selectedRecord.surgeries.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {selectedRecord.surgeries.map((surgery, index) => (
                                                                <div key={index} className="text-purple-700 text-sm font-medium border-b border-purple-200 pb-1 last:border-b-0 last:pb-0">
                                                                    • {surgery}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm italic">Không có phẫu thuật</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Family History */}
                                            <div className="space-y-3">
                                                <h4 className="flex items-center font-bold text-gray-800 text-sm uppercase tracking-wide">
                                                    <Users className="mr-2 text-green-500" size={16} />
                                                    Tiền sử gia đình
                                                </h4>
                                                <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                                                    {selectedRecord.familyHistory.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {selectedRecord.familyHistory.map((history, index) => (
                                                                <div key={index} className="text-green-700 text-sm font-medium border-b border-green-200 pb-1 last:border-b-0 last:pb-0">
                                                                    • {history}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm italic">Không có tiền sử gia đình</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Medical Record Actions */}
                                        <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
                                            <button className="bg-[#145566] text-white px-4 py-2 rounded text-sm hover:bg-[#0f3f44] transition-colors">
                                                Chỉnh sửa bệnh án
                                            </button>
                                            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
                                                Xuất PDF
                                            </button>
                                            <button className="text-red-600 hover:text-red-700 px-4 py-2 transition-colors text-sm">
                                                Xóa bệnh án
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Instructions when no record selected */}
                            {selectedRecords.length === 0 && medicalHistory.length > 0 && (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
                                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Chọn bệnh án để xem chi tiết</h3>
                                    <p className="text-gray-500">Nhấp vào các bệnh án trong danh sách bên trái để xem thông tin chi tiết. Bạn có thể chọn nhiều bệnh án cùng lúc.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
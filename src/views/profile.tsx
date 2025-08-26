import React from 'react';
import { User, Mail, MapPin, Globe, Calendar, Edit3, Save, X } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import useProfileController from '../controllers/useProfileController';

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-[#145566] to-[#145569] h-32"></div>
                        <div className="relative px-6 pb-6">
                            <div className="flex items-start space-x-6 -mt-16">
                                <div className="relative">
                                    <img
                                        src={profile.avatarUrl || '/avatar.webp'}
                                        alt="Avatar"
                                        className="w-32 h-32 rounded-full border-4 border-white object-cover"
                                    />
                                </div>
                                <div className="flex-1 mt-16">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                                            <p className="text-gray-600 mt-1">{profile.email}</p>
                                        </div>
                                        <button
                                            onClick={isEditing ? cancelEdit : startEdit}
                                            className="flex items-center space-x-2 bg-[#145566] text-white px-4 py-2 rounded-lg hover:bg-[#0f3f44] transition-colors"
                                        >
                                            {isEditing ? (
                                                <>
                                                    <X size={16} />
                                                    <span>Hủy</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Edit3 size={16} />
                                                    <span>Chỉnh sửa</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Thông tin cá nhân */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-[#145566] mb-4 flex items-center">
                                <User className="mr-2" size={20} />
                                Thông tin cá nhân
                            </h2>
                            
                            <div className="space-y-4">
                                {/* Tên */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => updateEditForm('name', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#145566]"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">{profile.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Mail size={16} className="mr-1" />
                                        Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => updateEditForm('email', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#145566]"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">{profile.email}</p>
                                    )}
                                </div>

                                {/* Ngày sinh */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Calendar size={16} className="mr-1" />
                                        Ngày sinh
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={editForm.dob}
                                            onChange={(e) => updateEditForm('dob', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#145566]"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">{formatDate(profile.dob)}</p>
                                    )}
                                </div>

                                {/* Địa chỉ */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <MapPin size={16} className="mr-1" />
                                        Địa chỉ
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.location || ''}
                                            onChange={(e) => updateEditForm('location', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#145566]"
                                            placeholder="Nhập địa chỉ"
                                        />
                                    ) : (
                                        <p className="mt-1 text-gray-900">{profile.location || 'Chưa cập nhật'}</p>
                                    )}
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Globe size={16} className="mr-1" />
                                        Website
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={editForm.website || ''}
                                            onChange={(e) => updateEditForm('website', e.target.value)}
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#145566]"
                                            placeholder="https://example.com"
                                        />
                                    ) : (
                                        <p className="mt-1">
                                            {profile.website ? (
                                                <a 
                                                    href={profile.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-[#145566] hover:underline"
                                                >
                                                    {profile.website}
                                                </a>
                                            ) : (
                                                <span className="text-gray-900">Chưa cập nhật</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6 flex space-x-3">
                                    <button
                                        onClick={saveProfile}
                                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Save size={16} />
                                        <span>Lưu thay đổi</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Giới thiệu */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-[#145566] mb-4">Giới thiệu</h2>
                            
                            {isEditing ? (
                                <textarea
                                    value={editForm.bio || ''}
                                    onChange={(e) => updateEditForm('bio', e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#145566]"
                                    placeholder="Viết một chút về bản thân..."
                                />
                            ) : (
                                <div className="text-gray-700">
                                    {profile.bio ? (
                                        <p className="leading-relaxed">{profile.bio}</p>
                                    ) : (
                                        <p className="text-gray-500 italic">Chưa có thông tin giới thiệu</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thống kê */}
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-[#145566] mb-4">Thống kê hoạt động</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-[#145566]">12</div>
                                <div className="text-sm text-gray-600">Lượt chẩn đoán</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-[#145566]">3</div>
                                <div className="text-sm text-gray-600">Bệnh án</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-[#145566]">30</div>
                                <div className="text-sm text-gray-600">Ngày sử dụng</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Profile;
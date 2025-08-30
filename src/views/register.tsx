import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ArrowRight, Calendar, Eye, EyeOff, Lock, Mail, MapPin, User} from 'lucide-react';
import {useRegisterController} from '../controllers/useRegisterController';

const Register: React.FC = () => {
    const { formData, errors, isLoading, updateField, handleSubmit } = useRegisterController();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        
        setMessage({
            type: result.success ? 'success' : 'error',
            text: result.message
        });

        if (result.success) {
            // Redirect to home page after successful registration and auto-login
            setTimeout(() => {
                navigate('/');
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Register Form Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-lg mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Logo */}
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-[#145566] rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <img src={"/logo-white.png"} alt={"Logo"}/>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Tạo tài khoản mới</h2>
                                <p className="text-gray-600 mt-2">Trở thành thành viên của chúng tôi</p>
                            </div>

                            {/* Message Display */}
                            {message && (
                                <div className={`mb-6 p-4 rounded-lg ${
                                    message.type === 'success' 
                                        ? 'bg-green-50 text-green-600 border border-green-200' 
                                        : 'bg-red-50 text-red-600 border border-red-200'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            {/* Register Form */}
                            <form onSubmit={onSubmit} className="space-y-3">
                                {/* Name Fields - First Name and Last Name in one row */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* First Name Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => updateField('firstName', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145566] transition-colors ${
                                                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                                placeholder="Nhập họ của bạn"
                                            />
                                        </div>
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                        )}
                                    </div>

                                    {/* Last Name Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => updateField('lastName', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145566] transition-colors ${
                                                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                                placeholder="Nhập tên của bạn"
                                            />
                                        </div>
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145566] transition-colors ${
                                                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Nhập email của bạn"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Date of Birth Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày sinh
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            value={formData.dob}
                                            onChange={(e) => updateField('dob', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145566] transition-colors ${
                                                errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.dob && (
                                        <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                                    )}
                                </div>

                                {/* Location Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ (tùy chọn)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => updateField('location', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145566] transition-colors"
                                            placeholder="Thành phố, tỉnh của bạn"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145566] transition-colors ${
                                                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Tạo mật khẩu mạnh"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={(e) => updateField('confirmPassword', e.target.value)}
                                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145566] transition-colors ${
                                                errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Nhập lại mật khẩu"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Terms Agreement */}
                                <div className="flex items-center">
                                    <input
                                        id="agree-terms"
                                        name="agree-terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-[#145566] focus:ring-[#145566] border-gray-300 rounded"
                                        required
                                    />
                                    <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-600">
                                        Tôi đồng ý với{' '}
                                        <Link to="/terms" className="text-[#145566] hover:text-[#0f3f44] font-medium">
                                            Điều khoản sử dụng
                                        </Link>{' '}
                                        và{' '}
                                        <Link to="/privacy" className="text-[#145566] hover:text-[#0f3f44] font-medium">
                                            Chính sách bảo mật
                                        </Link>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#145566] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#0f3f44] focus:outline-none focus:ring-2 focus:ring-[#145566] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Tạo tài khoản</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">hoặc</span>
                                    </div>
                                </div>

                                {/* Login Link */}
                                <div className="text-center">
                                    <p className="text-gray-600">
                                        Đã có tài khoản?{' '}
                                        <Link to="/login" className="text-[#145566] hover:text-[#0f3f44] font-medium">
                                            Đăng nhập ngay
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Register;
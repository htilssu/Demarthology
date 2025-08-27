import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useLoginController } from '../controllers/useLoginController';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Login: React.FC = () => {
    const { formData, errors, isLoading, updateField, handleSubmit } = useLoginController();
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        
        setMessage({
            type: result.success ? 'success' : 'error',
            text: result.message
        });

        if (result.success) {
            // Redirect to dashboard or home page
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Hero Section */}
            <section className="pt-20 pb-16 bg-gradient-to-r from-[#145566] to-[#0e3e46]">
                <div className="container mx-auto px-6">
                    <div className="text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Đăng Nhập</h1>
                        <p className="text-lg md:text-xl opacity-90">
                            Chào mừng bạn trở lại với hệ thống chẩn đoán da liễu AI
                        </p>
                    </div>
                </div>
            </section>

            {/* Login Form Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Logo */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-[#145566] rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">AI</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Đăng nhập tài khoản</h2>
                                <p className="text-gray-600 mt-2">Truy cập vào hệ thống chẩn đoán</p>
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

                            {/* Login Form */}
                            <form onSubmit={onSubmit} className="space-y-6">
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
                                            placeholder="Nhập mật khẩu của bạn"
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

                                {/* Remember & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-[#145566] focus:ring-[#145566] border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                            Ghi nhớ đăng nhập
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="text-[#145566] hover:text-[#0f3f44] font-medium">
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
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
                                            <span>Đăng nhập</span>
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

                                {/* Register Link */}
                                <div className="text-center">
                                    <p className="text-gray-600">
                                        Chưa có tài khoản?{' '}
                                        <Link to="/register" className="text-[#145566] hover:text-[#0f3f44] font-medium">
                                            Đăng ký ngay
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-[#145566] mb-2">
                                    Hệ thống chẩn đoán da liễu AI
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Công nghệ AI tiên tiến với độ chính xác cao, hỗ trợ chẩn đoán nhanh chóng và hiệu quả.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Login;
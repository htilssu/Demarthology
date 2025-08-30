import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useForgotPasswordController } from '../controllers/useForgotPasswordController';

const ForgotPassword: React.FC = () => {
    const { formData, errors, isLoading, updateField, handleSubmit } = useForgotPasswordController();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        
        setMessage({
            type: result.success ? 'success' : 'error',
            text: result.message
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Forgot Password Form Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Logo */}
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-[#145566] rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <img alt={"logo"} src={'/logo-white.png'}/>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu</h2>
                                <p className="text-gray-600 mt-2">Nhập email để nhận liên kết đặt lại mật khẩu</p>
                            </div>

                            {/* Message Display */}
                            {message && (
                                <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                                    message.type === 'success' 
                                        ? 'bg-green-50 text-green-600 border border-green-200' 
                                        : 'bg-red-50 text-red-600 border border-red-200'
                                }`}>
                                    {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            {/* Forgot Password Form */}
                            <form onSubmit={onSubmit} className="space-y-3">
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
                                            type="text"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145566] transition-colors ${
                                                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Nhập email đã đăng ký"
                                            disabled={message?.type === 'success'}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Information Box */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-700">
                                        📧 Chúng tôi sẽ gửi một liên kết đặt lại mật khẩu đến email của bạn. 
                                        Vui lòng kiểm tra cả hộp thư spam nếu không thấy email.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || message?.type === 'success'}
                                    className="w-full bg-[#145566] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#0f3f44] focus:outline-none focus:ring-2 focus:ring-[#145566] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Gửi liên kết đặt lại</span>
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

                                {/* Back to Login Link */}
                                <div className="text-center">
                                    <p className="text-gray-600">
                                        Nhớ mật khẩu rồi?{' '}
                                        <Link to="/login" className="text-[#145566] hover:text-[#0f3f44] font-medium">
                                            Đăng nhập ngay
                                        </Link>
                                    </p>
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
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ForgotPassword;
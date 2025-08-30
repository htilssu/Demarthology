import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useResetPasswordController } from '../controllers/useResetPasswordController';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';
    
    const { formData, errors, isLoading, updateField, handleSubmit } = useResetPasswordController(token);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (!token) {
            setMessage({
                type: 'error',
                text: 'Token không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.'
            });
        }
    }, [token]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        
        setMessage({
            type: result.success ? 'success' : 'error',
            text: result.message
        });

        if (result.success) {
            // Redirect to login page after successful password reset
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Reset Password Form Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Logo */}
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-[#145566] rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <img alt={"logo"} src={'/logo-white.png'}/>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
                                <p className="text-gray-600 mt-2">Tạo mật khẩu mới cho tài khoản của bạn</p>
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

                            {/* Reset Password Form */}
                            <form onSubmit={onSubmit} className="space-y-3">
                                {/* New Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu mới
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
                                            placeholder="Nhập mật khẩu mới"
                                            disabled={!token || message?.type === 'error'}
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
                                        Xác nhận mật khẩu mới
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
                                            placeholder="Nhập lại mật khẩu mới"
                                            disabled={!token || message?.type === 'error'}
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

                                {/* Password Requirements */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-blue-800 mb-2">Yêu cầu mật khẩu:</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Ít nhất 8 ký tự</li>
                                        <li>• Chứa ít nhất 1 chữ cái viết hoa</li>
                                        <li>• Chứa ít nhất 1 chữ số</li>
                                        <li>• Chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)</li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !token || message?.type === 'error'}
                                    className="w-full bg-[#145566] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#0f3f44] focus:outline-none focus:ring-2 focus:ring-[#145566] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Đặt lại mật khẩu</span>
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
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ResetPassword;
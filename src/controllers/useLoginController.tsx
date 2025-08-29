import { useState } from 'react';
import { LoginFormData, AuthResponse, FormValidationErrors } from '../models/auth';
import { useAuth } from '../contexts/AuthContext';

export const useLoginController = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState<FormValidationErrors>({});
    const { login, isLoading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const updateField = (field: keyof LoginFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormValidationErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (): Promise<AuthResponse> => {
        if (!validateForm()) {
            return { success: false, message: 'Vui lòng kiểm tra lại thông tin' };
        }

        setIsLoading(true);

        try {
            // Use actual AuthService through AuthContext
            await login({
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe
            });

            setIsLoading(false);
            return {
                success: true,
                message: 'Đăng nhập thành công!'
            };
        } catch (error: any) {
            setIsLoading(false);
            return {
                success: false,
                message: error.message || 'Có lỗi xảy ra, vui lòng thử lại'
            };
        }
    };

    return {
        formData,
        errors,
        isLoading: isLoading || authLoading,
        updateField,
        handleSubmit
    };
};
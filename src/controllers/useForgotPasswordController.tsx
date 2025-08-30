import { useState } from 'react';
import { ForgotPasswordFormData, AuthResponse, FormValidationErrors } from '../models/auth';

export const useForgotPasswordController = () => {
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: ''
    });
    const [errors, setErrors] = useState<FormValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const updateField = (field: keyof ForgotPasswordFormData, value: string) => {
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (): Promise<AuthResponse> => {
        if (!validateForm()) {
            return { success: false, message: 'Vui lòng kiểm tra lại thông tin' };
        }

        setIsLoading(true);

        try {
            // Simulate API call for forgot password
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setIsLoading(false);
            return {
                success: true,
                message: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!'
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
        isLoading,
        updateField,
        handleSubmit
    };
};
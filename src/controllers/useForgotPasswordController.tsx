import { useState } from 'react';
import { ForgotPasswordFormData, AuthResponse, FormValidationErrors } from '../models/auth';
import { validateEmail, formatEmail } from '../utils/validation';

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

        // Use custom email validation
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.error;
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
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo purposes, always return success
            // In real implementation, this would call an API with the formatted email
            return { 
                success: true, 
                message: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.' 
            };
        } catch (error) {
            return { 
                success: false, 
                message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' 
            };
        } finally {
            setIsLoading(false);
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
import { useState } from 'react';
import { authService } from '../services/auth';

interface ForgotPasswordFormData {
    email: string;
}

interface FormValidationErrors {
    email?: string;
}

export const useForgotPasswordController = () => {
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: ''
    });
    const [errors, setErrors] = useState<FormValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const updateField = (field: keyof ForgotPasswordFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
        // Clear message when user starts typing
        if (message) {
            setMessage(null);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormValidationErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (): Promise<{ success: boolean; message: string }> => {
        if (!validateForm()) {
            return { success: false, message: 'Vui lòng kiểm tra lại thông tin' };
        }

        setIsLoading(true);

        try {
            const result = await authService.forgotPassword(formData.email);
            
            setMessage({
                type: 'success',
                text: result.message
            });

            setIsLoading(false);
            return {
                success: true,
                message: result.message
            };
        } catch (error: any) {
            const errorMessage = error.message || 'Có lỗi xảy ra, vui lòng thử lại';
            
            setMessage({
                type: 'error',
                text: errorMessage
            });

            setIsLoading(false);
            return {
                success: false,
                message: errorMessage
            };
        }
    };

    return {
        formData,
        errors,
        isLoading,
        message,
        updateField,
        handleSubmit
    };
};
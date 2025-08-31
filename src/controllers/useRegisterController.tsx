import { useState } from 'react';
import { RegisterFormData, AuthResponse, FormValidationErrors } from '../models/auth';
import { AuthService } from '../services/auth';

export const useRegisterController = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        email: '',
        phone: '',
        password: '',
        dateOfBirth: ''
    });
    const [errors, setErrors] = useState<FormValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const authService = AuthService.getInstance();

    const updateField = (field: keyof RegisterFormData, value: string) => {
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

        if (!formData.phone) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
        } else {
            const dobDate = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - dobDate.getFullYear();
            if (age < 13) {
                newErrors.dateOfBirth = 'Bạn phải từ 13 tuổi trở lên';
            }
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
            // Call real API for registration with correct structure
            const userData = {
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                dateOfBirth: formData.dateOfBirth
            };

            const userProfile = await authService.register(userData);

            // Convert UserProfile to AuthUser for backward compatibility
            const authUser = authService.convertUserProfileToAuthUser(userProfile);

            setIsLoading(false);
            return {
                success: true,
                message: 'Đăng ký thành công',
                user: authUser
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
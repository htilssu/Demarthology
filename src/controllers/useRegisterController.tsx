import { useState } from 'react';
import { RegisterFormData, AuthResponse, FormValidationErrors } from '../models/auth';

export const useRegisterController = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        location: ''
    });
    const [errors, setErrors] = useState<FormValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const updateField = (field: keyof RegisterFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormValidationErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên là bắt buộc';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Tên phải có ít nhất 2 ký tự';
        }

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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (!formData.dob) {
            newErrors.dob = 'Ngày sinh là bắt buộc';
        } else {
            const dobDate = new Date(formData.dob);
            const today = new Date();
            const age = today.getFullYear() - dobDate.getFullYear();
            if (age < 13) {
                newErrors.dob = 'Bạn phải từ 13 tuổi trở lên';
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful registration
            const mockUser = {
                id: '1',
                name: formData.name,
                email: formData.email,
                avatarUrl: '/avatar.webp'
            };

            setIsLoading(false);
            return {
                success: true,
                message: 'Đăng ký thành công!',
                user: mockUser
            };
        } catch (error) {
            setIsLoading(false);
            return {
                success: false,
                message: 'Có lỗi xảy ra, vui lòng thử lại'
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
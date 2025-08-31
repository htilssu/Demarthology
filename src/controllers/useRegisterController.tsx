import { useState } from 'react';
import { RegisterFormData, AuthResponse, FormValidationErrors } from '../models/auth';
import { AuthService } from '../services/auth';

export const useRegisterController = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        location: ''
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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Họ là bắt buộc';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'Họ phải có ít nhất 2 ký tự';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Tên là bắt buộc';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Tên phải có ít nhất 2 ký tự';
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
            // Call real API for registration with correct structure
            const userData = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dob: formData.dob,
                phone: "0123456789" // Default phone for now
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
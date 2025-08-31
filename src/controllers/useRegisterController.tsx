import { useState } from 'react';
import { RegisterFormData, AuthResponse, FormValidationErrors } from '../models/auth';
import { AuthService } from '../services/auth';

// Extended form data for UI (includes confirmPassword and agreeTerms for validation)
interface RegisterFormState extends RegisterFormData {
    confirmPassword: string;
    agreeTerms: boolean;
}

export const useRegisterController = () => {
    const [formData, setFormData] = useState<RegisterFormState>({
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState<FormValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const authService = AuthService.getInstance();

    const updateField = (field: keyof RegisterFormState, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
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

        // Phone validation
        if (!formData.phone) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        // Date of birth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
        } else {
            // Validate date format yyyy-mm-dd
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(formData.dateOfBirth)) {
                newErrors.dateOfBirth = 'Ngày sinh phải có định dạng yyyy-mm-dd';
            } else {
                const dobDate = new Date(formData.dateOfBirth);
                const today = new Date();
                
                // Check if date is valid
                if (isNaN(dobDate.getTime())) {
                    newErrors.dateOfBirth = 'Ngày sinh không hợp lệ';
                } else {
                    const age = today.getFullYear() - dobDate.getFullYear();
                    const monthDiff = today.getMonth() - dobDate.getMonth();
                    
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                        // Birthday hasn't occurred this year
                    }
                    
                    if (age < 13) {
                        newErrors.dateOfBirth = 'Bạn phải từ 13 tuổi trở lên';
                    } else if (age > 120) {
                        newErrors.dateOfBirth = 'Ngày sinh không hợp lệ';
                    }
                }
            }
        }

        // Terms agreement validation
        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
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
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
        name: '',
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

        // Real-time validation for certain fields
        if (typeof value === 'string' && value.length > 0) {
            const newErrors: FormValidationErrors = {};
            
            switch (field) {
                case 'email':
                    const email = value.trim();
                    // Check for Vietnamese characters first
                    const vietnameseCharRegex = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (email && vietnameseCharRegex.test(email)) {
                        newErrors.email = 'Email không được chứa ký tự tiếng Việt';
                    } else if (email && !emailRegex.test(email)) {
                        newErrors.email = 'Email không hợp lệ';
                    }
                    break;
                
                case 'phone':
                    const phone = value.replace(/[\s\-().]/g, '');
                    if (phone && (!/^[0-9]+$/.test(phone) || phone.length < 10)) {
                        newErrors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
                    }
                    break;
                
                case 'confirmPassword':
                    if (value && formData.password && value !== formData.password) {
                        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
                    }
                    break;
                
                case 'name':
                    const name = value.trim();
                    if (name && (name.length < 2 || !/^[a-zA-ZÀ-ỹ\s]+$/.test(name))) {
                        newErrors.name = name.length < 2 ? 'Họ tên phải có ít nhất 2 ký tự' : 'Họ tên chỉ được chứa chữ cái và khoảng trắng';
                    }
                    break;
                
                case 'dateOfBirth':
                    if (value && value.length === 10) { // Full date entered
                        const dobDate = new Date(value + 'T00:00:00');
                        const today = new Date();
                        if (dobDate > today) {
                            newErrors.dateOfBirth = 'Ngày sinh không thể ở tương lai';
                        }
                    }
                    break;
            }
            
            setErrors(prev => ({ ...prev, ...newErrors }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormValidationErrors = {};

        // Name validation
        if (!formData.name || !formData.name.trim()) {
            newErrors.name = 'Họ tên là bắt buộc';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Họ tên không được quá 50 ký tự';
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.name.trim())) {
            newErrors.name = 'Họ tên chỉ được chứa chữ cái và khoảng trắng';
        }

        // Email validation
        if (!formData.email || !formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else {
            const email = formData.email.trim();
            // Check for Vietnamese characters first
            const vietnameseCharRegex = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (vietnameseCharRegex.test(email)) {
                newErrors.email = 'Email không được chứa ký tự tiếng Việt';
            } else if (!emailRegex.test(email)) {
                newErrors.email = 'Email không hợp lệ';
            } else if (email.length > 254) {
                newErrors.email = 'Email quá dài';
            }
        }

        // Phone validation
        if (!formData.phone || !formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else {
            const phone = formData.phone.replace(/[\s\-().]/g, ''); // Remove spaces, hyphens, parentheses, dots
            if (!/^[0-9]+$/.test(phone)) {
                newErrors.phone = 'Số điện thoại chỉ được chứa số';
            } else if (phone.length < 10 || phone.length > 11) {
                newErrors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
            } else if (!phone.startsWith('0')) {
                newErrors.phone = 'Số điện thoại phải bắt đầu bằng số 0';
            }
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.trim() !== formData.password) {
            newErrors.password = 'Mật khẩu không được có khoảng trắng ở đầu hoặc cuối';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        } else if (formData.password.length > 100) {
            newErrors.password = 'Mật khẩu không được quá 100 ký tự';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        // Date of birth validation
        if (!formData.dateOfBirth || !formData.dateOfBirth.trim()) {
            newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
        } else {
            // Validate date format yyyy-mm-dd
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(formData.dateOfBirth)) {
                newErrors.dateOfBirth = 'Ngày sinh phải có định dạng yyyy-mm-dd';
            } else {
                const dobDate = new Date(formData.dateOfBirth + 'T00:00:00'); // Add time to ensure local timezone
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
                
                // Check if date is valid
                if (isNaN(dobDate.getTime())) {
                    newErrors.dateOfBirth = 'Ngày sinh không hợp lệ';
                } else {
                    // Validate that the date string actually represents the parsed date
                    // This catches invalid dates like Feb 30, Apr 31, etc.
                    const [year, month, day] = formData.dateOfBirth.split('-').map(Number);
                    if (dobDate.getFullYear() !== year || 
                        dobDate.getMonth() !== month - 1 || 
                        dobDate.getDate() !== day) {
                        newErrors.dateOfBirth = 'Ngày sinh không tồn tại';
                    } else {
                        let age = today.getFullYear() - dobDate.getFullYear();
                        const monthDiff = today.getMonth() - dobDate.getMonth();
                        
                        // Adjust age if birthday hasn't occurred this year
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                            age--;
                        }
                        
                        // Check for future dates
                        if (dobDate > today) {
                            newErrors.dateOfBirth = 'Ngày sinh không thể ở tương lai';
                        } else if (age < 13) {
                            newErrors.dateOfBirth = 'Bạn phải từ 13 tuổi trở lên';
                        } else if (age > 120) {
                            newErrors.dateOfBirth = 'Ngày sinh không hợp lệ (quá 120 tuổi)';
                        }
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
                email: formData.email.trim(),
                phone: formData.phone.replace(/[\s\-().]/g, ''), // Clean phone number for API
                password: formData.password,
                dateOfBirth: formData.dateOfBirth,
                name: formData.name.trim()
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
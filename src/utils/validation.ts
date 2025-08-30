/**
 * Custom validation utilities for form inputs
 */

/**
 * Custom email validation function
 * More comprehensive than basic regex, handles edge cases
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
    // Check if email is empty
    if (!email || email.trim() === '') {
        return {
            isValid: false,
            error: 'Email là bắt buộc'
        };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Basic format check - must contain @ and .
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
        return {
            isValid: false,
            error: 'Email phải có định dạng hợp lệ (ví dụ: example@domain.com)'
        };
    }

    // More comprehensive email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Email không đúng định dạng'
        };
    }

    // Check for consecutive dots
    if (trimmedEmail.includes('..')) {
        return {
            isValid: false,
            error: 'Email không được chứa hai dấu chấm liền nhau'
        };
    }

    // Check email length (RFC 5321 limits)
    if (trimmedEmail.length > 254) {
        return {
            isValid: false,
            error: 'Email quá dài (tối đa 254 ký tự)'
        };
    }

    // Split email to check local and domain parts
    const [localPart, domainPart] = trimmedEmail.split('@');
    
    if (localPart.length > 64) {
        return {
            isValid: false,
            error: 'Phần tên người dùng quá dài'
        };
    }

    if (domainPart.length > 253) {
        return {
            isValid: false,
            error: 'Phần tên miền quá dài'
        };
    }

    // Check if domain has at least one dot
    if (!domainPart.includes('.')) {
        return {
            isValid: false,
            error: 'Tên miền không hợp lệ'
        };
    }

    // Check for valid domain ending
    const domainParts = domainPart.split('.');
    const lastPart = domainParts[domainParts.length - 1];
    if (lastPart.length < 2) {
        return {
            isValid: false,
            error: 'Phần cuối của tên miền không hợp lệ'
        };
    }

    return {
        isValid: true
    };
};

/**
 * Get formatted email (trim and lowercase)
 */
export const formatEmail = (email: string): string => {
    return email.trim().toLowerCase();
};
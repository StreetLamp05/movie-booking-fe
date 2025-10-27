export const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
};


export const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
    return null;
};


export const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === '') return `${fieldName} is required`;
    return null;
};


export const validatePhone = (phone: string): string | null => {
    if (!phone) return null; // Phone is optional
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) return 'Please enter a valid 10-digit phone number';
    return null;
};


export const validateZipCode = (zip: string): string | null => {
    if (!zip) return 'ZIP code is required';
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zip)) return 'Please enter a valid 5-digit ZIP code';
    return null;
};


export const validateCardNumber = (cardNumber: string): string | null => {
    if (!cardNumber) return 'Card number is required';
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return 'Please enter a valid card number';

    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }

    if (sum % 10 !== 0) return 'Invalid card number';
    return null;
};


export const validateCVV = (cvv: string): string | null => {
    if (!cvv) return 'CVV is required';
    if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
    return null;
};


export const validateExpirationDate = (month: number, year: number): string | null => {
    if (!month || !year) return 'Expiration date is required';
    if (month < 1 || month > 12) return 'Invalid month';

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return 'Card has expired';
    }

    return null;
};

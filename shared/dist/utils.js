"use strict";
// Common utility functions shared between frontend and backend
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateArray = exports.validateEmail = exports.generateSlug = exports.formatDate = exports.formatPrice = void 0;
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};
exports.formatPrice = formatPrice;
const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObj);
};
exports.formatDate = formatDate;
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};
exports.generateSlug = generateSlug;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const paginateArray = (array, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = array.slice(startIndex, endIndex);
    return {
        data,
        pagination: {
            page,
            limit,
            total: array.length,
            totalPages: Math.ceil(array.length / limit),
        },
    };
};
exports.paginateArray = paginateArray;
//# sourceMappingURL=utils.js.map
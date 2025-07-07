"use strict";
// Common constants shared between frontend and backend
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGINATION = exports.PRODUCT_CATEGORIES = exports.USER_ROLES = exports.HTTP_STATUS = exports.API_ENDPOINTS = void 0;
exports.API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
    },
    USERS: {
        PROFILE: '/api/users/profile',
        UPDATE: '/api/users/profile',
    },
    PRODUCTS: {
        LIST: '/api/products',
        CREATE: '/api/products',
        DETAIL: (id) => `/api/products/${id}`,
        UPDATE: (id) => `/api/products/${id}`,
        DELETE: (id) => `/api/products/${id}`,
    },
    VENDORS: {
        LIST: '/api/vendors',
        CREATE: '/api/vendors',
        DETAIL: (id) => `/api/vendors/${id}`,
        UPDATE: (id) => `/api/vendors/${id}`,
        VERIFY: (id) => `/api/vendors/${id}/verify`,
    },
    UPLOADS: {
        IMAGE: '/api/uploads/image',
    },
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};
exports.USER_ROLES = {
    USER: 'user',
    VENDOR: 'vendor',
    ADMIN: 'admin',
};
exports.PRODUCT_CATEGORIES = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Books',
    'Sports & Outdoors',
    'Beauty & Health',
    'Toys & Games',
    'Automotive',
    'Food & Beverages',
    'Other',
];
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};
//# sourceMappingURL=constants.js.map
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'vendor' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    vendorId: string;
    images: string[];
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Vendor {
    id: string;
    userId: string;
    businessName: string;
    description: string;
    logo?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=types.d.ts.map
export declare const formatPrice: (price: number) => string;
export declare const formatDate: (date: Date | string) => string;
export declare const generateSlug: (text: string) => string;
export declare const validateEmail: (email: string) => boolean;
export declare const paginateArray: <T>(array: T[], page: number, limit: number) => {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
//# sourceMappingURL=utils.d.ts.map
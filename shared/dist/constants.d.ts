export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/api/auth/login";
        readonly REGISTER: "/api/auth/register";
        readonly LOGOUT: "/api/auth/logout";
        readonly REFRESH: "/api/auth/refresh";
    };
    readonly USERS: {
        readonly PROFILE: "/api/users/profile";
        readonly UPDATE: "/api/users/profile";
    };
    readonly PRODUCTS: {
        readonly LIST: "/api/products";
        readonly CREATE: "/api/products";
        readonly DETAIL: (id: string) => string;
        readonly UPDATE: (id: string) => string;
        readonly DELETE: (id: string) => string;
    };
    readonly VENDORS: {
        readonly LIST: "/api/vendors";
        readonly CREATE: "/api/vendors";
        readonly DETAIL: (id: string) => string;
        readonly UPDATE: (id: string) => string;
        readonly VERIFY: (id: string) => string;
    };
    readonly UPLOADS: {
        readonly IMAGE: "/api/uploads/image";
    };
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const USER_ROLES: {
    readonly USER: "user";
    readonly VENDOR: "vendor";
    readonly ADMIN: "admin";
};
export declare const PRODUCT_CATEGORIES: readonly ["Electronics", "Clothing", "Home & Garden", "Books", "Sports & Outdoors", "Beauty & Health", "Toys & Games", "Automotive", "Food & Beverages", "Other"];
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 10;
    readonly MAX_LIMIT: 100;
};
//# sourceMappingURL=constants.d.ts.map
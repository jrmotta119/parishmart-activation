"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const shared_1 = require("@parishmart/shared");
const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = shared_1.HTTP_STATUS.NOT_FOUND;
    next(error);
};
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map
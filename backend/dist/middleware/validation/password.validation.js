"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordSecurityMiddleware = void 0;
const password_security_1 = require("../../utils/password.security");
const passwordSecurityMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    if (!password) {
        return next(); // Let Joi validation handle missing password
    }
    try {
        // Check if password has been breached
        const isBreached = yield (0, password_security_1.checkPasswordBreach)(password);
        if (isBreached) {
            return res.status(400).json({
                success: false,
                message: 'This password has been found in data breaches. Please choose a different password.',
                type: 'PASSWORD_BREACHED'
            });
        }
        next();
    }
    catch (error) {
        console.error('Password security check error:', error);
        next(); // Continue if security check fails
    }
});
exports.passwordSecurityMiddleware = passwordSecurityMiddleware;
//# sourceMappingURL=password.validation.js.map
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateLegacyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const session_utils_1 = require("./session.utils");
const jwt_enhanced_1 = require("./jwt.enhanced");
const migrateLegacyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const legacyToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (legacyToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(legacyToken, process.env.JWT_SECRET_KEY);
            // Create session for legacy token
            const sessionId = yield (0, session_utils_1.createUserSession)(decoded.userId, req, 'migration');
            // Generate new token pair
            const { accessToken, refreshToken } = (0, jwt_enhanced_1.generateTokenPair)(decoded.userId, sessionId);
            // Set new cookies
            res.cookie("accessToken", accessToken, { /* options */});
            res.cookie("refreshToken", refreshToken, { /* options */});
            res.clearCookie("token"); // Remove legacy
            console.log('✅ Migrated legacy token to token pair for user:', decoded.userId);
        }
        catch (error) {
            console.log('❌ Legacy token migration failed:', error);
        }
    }
});
exports.migrateLegacyToken = migrateLegacyToken;
//# sourceMappingURL=migration.utilts.js.map
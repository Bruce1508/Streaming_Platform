interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
interface DecodedToken {
    userId: string;
    sessionId: string;
    type: 'access' | 'refresh';
    iat: number;
    exp: number;
}
export declare const generateTokenPair: (userId: string, sessionId: string) => TokenPair;
export declare const blacklistToken: (token: string) => Promise<void>;
export declare const isTokenBlacklisted: (token: string) => Promise<boolean>;
/**
 * Validate token type and return decoded payload
 */
export declare const validateTokenType: (token: string, expectedType: "access" | "refresh") => DecodedToken | null;
/**
 * Validate access token specifically
 */
export declare const validateAccessToken: (token: string) => Promise<DecodedToken | null>;
/**
 * Validate refresh token specifically
 */
export declare const validateRefreshToken: (token: string) => Promise<DecodedToken | null>;
/**
 * Refresh access token using refresh token with rotation
 */
export declare const refreshAccessToken: (refreshToken: string) => Promise<TokenPair | null>;
/**
 * Rotate refresh token (blacklist old, generate new pair)
 */
export declare const rotateRefreshToken: (oldRefreshToken: string, userId: string, sessionId: string) => Promise<TokenPair | null>;
/**
 * Revoke all tokens for a user session
 */
export declare const revokeAllTokensForSession: (sessionId: string) => Promise<boolean>;
/**
 * Get token metadata for debugging/monitoring
 */
export declare const getTokenMetadata: (token: string) => any;
/**
 * Check if access token needs refresh (expires in < 5 minutes)
 */
export declare const shouldRefreshToken: (accessToken: string) => boolean;
export {};
//# sourceMappingURL=jwt.enhanced.d.ts.map
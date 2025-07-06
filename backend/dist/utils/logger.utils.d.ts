interface LogLevel {
    ERROR: 'error';
    WARN: 'warn';
    INFO: 'info';
    DEBUG: 'debug';
}
declare const LOG_LEVELS: LogLevel;
interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    data?: any;
    userId?: string;
    sessionId?: string;
    ip?: string;
    userAgent?: string;
}
declare class Logger {
    private isDevelopment;
    constructor();
    private formatLog;
    private log;
    error(message: string, error?: any): void;
    warn(message: string, data?: any): void;
    info(message: string, data?: any): void;
    debug(message: string, data?: any): void;
    auth(message: string, data?: {
        userId?: string;
        email?: string;
        action?: string;
    }): void;
    api(message: string, data?: {
        method?: string;
        path?: string;
        statusCode?: number;
        duration?: number;
    }): void;
    database(message: string, data?: {
        operation?: string;
        collection?: string;
        duration?: number;
    }): void;
    security(message: string, data?: {
        ip?: string;
        userAgent?: string;
        risk?: string;
    }): void;
    performance(message: string, data?: {
        operation?: string;
        duration?: number;
        memory?: number;
    }): void;
}
export declare const logger: Logger;
export type { LogEntry };
export { LOG_LEVELS };
//# sourceMappingURL=logger.utils.d.ts.map
// utils/logger.utils.ts
interface LogLevel {
    ERROR: 'error';
    WARN: 'warn'; 
    INFO: 'info';
    DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info', 
    DEBUG: 'debug'
};

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

class Logger {
    private isDevelopment: boolean;
    
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    private formatLog(level: string, message: string, data?: any): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            ...(data && { data })
        };
    }

    private log(level: string, message: string, data?: any): void {
        const logEntry = this.formatLog(level, message, data);
        
        // Console output with colors in development
        if (this.isDevelopment) {
            const colors = {
                error: '\x1b[31m',   // Red
                warn: '\x1b[33m',    // Yellow
                info: '\x1b[36m',    // Cyan
                debug: '\x1b[35m',   // Magenta
                reset: '\x1b[0m'     // Reset
            };
            
            const color = colors[level as keyof typeof colors] || colors.reset;
            console.log(
                `${color}[${logEntry.level}] ${logEntry.timestamp}: ${message}${colors.reset}`,
                data ? data : ''
            );
        } else {
            // Production: JSON format for log aggregation
            console.log(JSON.stringify(logEntry));
        }
    }

    // Public methods
    error(message: string, error?: any): void {
        const errorData = error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : error;
        
        this.log(LOG_LEVELS.ERROR, message, errorData);
    }

    warn(message: string, data?: any): void {
        this.log(LOG_LEVELS.WARN, message, data);
    }

    info(message: string, data?: any): void {
        this.log(LOG_LEVELS.INFO, message, data);
    }

    debug(message: string, data?: any): void {
        if (this.isDevelopment) {
            this.log(LOG_LEVELS.DEBUG, message, data);
        }
    }

    // Specialized logging methods
    auth(message: string, data?: { userId?: string; email?: string; action?: string }): void {
        this.info(`[AUTH] ${message}`, data);
    }

    api(message: string, data?: { method?: string; path?: string; statusCode?: number; duration?: number }): void {
        this.info(`[API] ${message}`, data);
    }

    database(message: string, data?: { operation?: string; collection?: string; duration?: number }): void {
        this.info(`[DB] ${message}`, data);
    }

    security(message: string, data?: { ip?: string; userAgent?: string; risk?: string }): void {
        this.warn(`[SECURITY] ${message}`, data);
    }

    performance(message: string, data?: { operation?: string; duration?: number; memory?: number }): void {
        this.info(`[PERF] ${message}`, data);
    }
}

// Export singleton logger instance
export const logger = new Logger();

// Export types for use in other files
export type { LogEntry };
export { LOG_LEVELS };
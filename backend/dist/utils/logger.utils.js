"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_LEVELS = exports.logger = void 0;
const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
};
exports.LOG_LEVELS = LOG_LEVELS;
class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }
    formatLog(level, message, data) {
        return Object.assign({ timestamp: new Date().toISOString(), level: level.toUpperCase(), message }, (data && { data }));
    }
    log(level, message, data) {
        const logEntry = this.formatLog(level, message, data);
        // Console output with colors in development
        if (this.isDevelopment) {
            const colors = {
                error: '\x1b[31m', // Red
                warn: '\x1b[33m', // Yellow
                info: '\x1b[36m', // Cyan
                debug: '\x1b[35m', // Magenta
                reset: '\x1b[0m' // Reset
            };
            const color = colors[level] || colors.reset;
            console.log(`${color}[${logEntry.level}] ${logEntry.timestamp}: ${message}${colors.reset}`, data ? data : '');
        }
        else {
            // Production: JSON format for log aggregation
            console.log(JSON.stringify(logEntry));
        }
    }
    // Public methods
    error(message, error) {
        const errorData = error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : error;
        this.log(LOG_LEVELS.ERROR, message, errorData);
    }
    warn(message, data) {
        this.log(LOG_LEVELS.WARN, message, data);
    }
    info(message, data) {
        this.log(LOG_LEVELS.INFO, message, data);
    }
    debug(message, data) {
        if (this.isDevelopment) {
            this.log(LOG_LEVELS.DEBUG, message, data);
        }
    }
    // Specialized logging methods
    auth(message, data) {
        this.info(`[AUTH] ${message}`, data);
    }
    api(message, data) {
        this.info(`[API] ${message}`, data);
    }
    database(message, data) {
        this.info(`[DB] ${message}`, data);
    }
    security(message, data) {
        this.warn(`[SECURITY] ${message}`, data);
    }
    performance(message, data) {
        this.info(`[PERF] ${message}`, data);
    }
}
// Export singleton logger instance
exports.logger = new Logger();
//# sourceMappingURL=logger.utils.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const material_routes_1 = __importDefault(require("./routes/material.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const db_1 = require("./lib/db");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const school_routes_1 = __importDefault(require("./routes/school.routes"));
const program_routes_1 = __importDefault(require("./routes/program.routes"));
const onboarding_routes_1 = __importDefault(require("./routes/onboarding.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
// ✅ Import all models to register schemas
require("./models/User");
require("./models/School");
require("./models/Program");
require("./models/Course");
require("./models/StudyMaterial");
require("./models/BookMark");
require("./models/Enrollment");
require("./models/File");
require("./models/Notification");
require("./models/Report");
require("./models/UserSession");
require("./models/friendRequest");
const app = (0, express_1.default)();
// ✅ Single CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Increase body size limit for large imports
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Security middleware
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
// ✅ API Routes - Session routes under /auth
app.use("/api/auth", auth_routes_1.default);
app.use("/api/sessions", session_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/chat", chat_routes_1.default);
app.use("/api/materials", material_routes_1.default);
app.use("/api/upload", upload_routes_1.default);
app.use("/api/courses", course_routes_1.default);
app.use("/api/schools", school_routes_1.default);
app.use("/api/programs", program_routes_1.default);
app.use("/api/onboarding", onboarding_routes_1.default);
// Handle undefined routes
app.all('/{*any}', error_middleware_1.notFound);
// ✅ Global error handler
app.use(error_middleware_1.errorHandler);
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    (0, db_1.connectDB)();
});
//# sourceMappingURL=server.js.map
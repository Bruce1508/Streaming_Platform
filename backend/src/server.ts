import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
// ✅ REMOVED: chatRoutes - stream.io no longer used
import sessionRoutes from './routes/session.routes';
import materialRoutes from "./routes/material.routes";
import uploadRoutes from "./routes/upload.routes";
import { connectDB } from "./lib/db";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ApiError } from "./utils/ApiError";
import courseRoutes from "./routes/course.routes";
import schoolRoutes from "./routes/school.routes";
import programRoutes from "./routes/program.routes";
import programReviewRoutes from "./routes/programReview.routes";
import onboardingRoutes from "./routes/onboarding.routes";
import notificationRoutes from "./routes/notification.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";
import { logger } from "./utils/logger.utils";

// ✅ Import all models to register schemas
import "./models/User";
import "./models/School";
import "./models/Program";
import "./models/ProgramReviews";
import "./models/StudyMaterial";
import "./models/BookMark";
import "./models/Enrollment";
import "./models/File";
import "./models/Notification";
import "./models/Report";
import "./models/UserSession";


const app = express();

// ✅ Single CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Increase body size limit for large imports
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ DEBUG: Log all incoming requests
app.use((req, res, next) => {
    console.log(`🔥 Backend: ${req.method} ${req.url} - ${new Date().toISOString()}`);
    console.log('📋 Backend: Request details:', {
        headers: {
            'content-type': req.headers['content-type'],
            'user-agent': req.headers['user-agent'],
            'origin': req.headers.origin
        },
        body: req.body,
        query: req.query
    });
    next();
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ✅ API Routes - Session routes under /auth
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);        
app.use("/api/users", userRoutes);
// ✅ REMOVED: /api/chat routes - stream.io no longer used
app.use("/api/materials", materialRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/program-reviews", programReviewRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/notifications", notificationRoutes);

// Handle undefined routes
app.all('/{*any}', notFound);

// ✅ Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
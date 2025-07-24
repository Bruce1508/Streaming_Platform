import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import sessionRoutes from './routes/session.routes';
import materialRoutes from "./routes/material.routes";
import uploadRoutes from "./routes/upload.routes";
import { connectDB } from "./lib/db";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import courseRoutes from "./routes/course.routes";
import schoolRoutes from "./routes/school.routes";
import programRoutes from "./routes/program.routes";
import programReviewRoutes from "./routes/programReview.routes";
import onboardingRoutes from "./routes/onboarding.routes";
import notificationRoutes from "./routes/notification.routes";
import { errorHandler, notFound } from "./middleWare/error.middleware";

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
    origin: process.env.FRONTEND_URL!!,
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
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS!!),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!!),
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);        
app.use("/api/users", userRoutes);
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
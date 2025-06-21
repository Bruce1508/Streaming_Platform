import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import sessionRoutes from './routes/session.routes';
import materialRoutes from "./routes/material.routes";
import uploadRoutes from "./routes/upload.routes";
import { connectDB } from "./lib/db";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ApiError } from "./utils/ApiError";

dotenv.config();

const app = express();

// ✅ Single CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

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
app.use("/api/sessions", sessionRoutes);        // ← Fixed path
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/upload", uploadRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// ✅ Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    } else {
        // Generic error
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
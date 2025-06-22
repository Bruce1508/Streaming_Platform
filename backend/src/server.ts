import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
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
import courseRoutes from "./routes/course.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";
import { logger } from "./utils/logger.utils";

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
app.use("/api/courses", courseRoutes);

// Handle undefined routes
app.all('/{*any}', notFound);

// ✅ Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
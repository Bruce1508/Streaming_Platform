import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import { connectDB } from "./lib/db";

dotenv.config();

const app = express();


app.use(helmet());

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
	res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
	connectDB();
});

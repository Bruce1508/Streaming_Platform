import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import mongoose from "mongoose";
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

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World");
});

app.use("/api/auth", authRoutes);

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
	connectDB();
});

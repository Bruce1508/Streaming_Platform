import express, { Request, Response } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controllers";

const router =  express.Router();

router.post("/sign-in", signIn);

router.post("/sign-up", signUp);

router.post("/sign-out", signOut);

export default router;
// This code defines a set of routes for user authentication in an Express application.
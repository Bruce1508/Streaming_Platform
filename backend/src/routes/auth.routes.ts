import express from "express";
import { signIn, signOut, signUp, onBoarding } from "../controllers/auth.controllers";
import { protectRoute } from "../middleWare/auth.middleware";

const router =  express.Router();

router.post("/sign-in", signIn);

router.post("/sign-up", signUp);

router.post("/sign-out", signOut);

router.post("/onboarding",protectRoute, onBoarding);

export default router;
// This code defines a set of routes for user authentication in an Express application.
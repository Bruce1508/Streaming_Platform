import express, { Request,Response } from "express";
import { signIn, signOut, signUp, onBoarding } from "../controllers/auth.controllers";
import { protectRoute } from "../middleWare/auth.middleware";

const router =  express.Router();

router.post("/sign-in", signIn);

router.post("/sign-up", signUp);

router.post("/sign-out", signOut);

router.post("/onBoarding",protectRoute, onBoarding);

// The protectRoute middleware checks if the user is authenticated
router.get("/me", protectRoute, (req: Request, res: Response): Response|any => {
    return res.status(200).json({success:true, user:req.user});
});

export default router;
// This code defines a set of routes for user authentication in an Express application.
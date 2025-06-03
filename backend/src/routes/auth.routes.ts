import express from "express";
import { signIn, signUp, onBoarding, getMe, oauth} from "../controllers/auth.controllers";
import { protectRoute } from "../middleWare/auth.middleware";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/onBoarding", protectRoute, onBoarding);
router.post("/oauth", oauth);

router.get("/me", protectRoute, getMe);

export default router;
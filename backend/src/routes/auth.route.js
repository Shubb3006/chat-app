import express from "express";
import { logout, signin, signup, updateProfile, check } from "../controllers/auth.controller.js";
import {protectedRoute} from "../middleware/auth.middleware.js"
const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/logout", logout);

router.put("/update-profile",protectedRoute,updateProfile)

router.get("/check",protectedRoute,check)
export default router;

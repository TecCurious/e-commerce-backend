import express from "express";
import { registerUser } from "../controller/authController.js";

const router = express.Router();

//user register route
router.post("/register", registerUser);


export default router;

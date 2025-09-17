import express from "express";
import { registerUser } from "../controller/authController.js";

const router = express.Router();

//user register route
router.post("/register", registerUser);

// router.get("/", (req, res)=>{

//     res.send("hello from auth route");
// })

export default router;

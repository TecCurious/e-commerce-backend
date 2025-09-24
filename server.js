import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoutes.js"
import { ConnectDB } from "./src/config/db.js";


const app=express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT=process.env.PORT;


ConnectDB();

app.use("/api/auth",authRouter);

app.get("/",(req,res)=>{
    res.send("server is running...");
});

app.listen(PORT,()=>{
    console.log(`app is running on the port ${PORT}....`);
});
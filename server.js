import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./src/config/db.js";

const app=express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT=process.env.PORT;


ConnectDB();

app.get("/",(req,res)=>{
    res.send("server is running...");
});

app.listen(PORT,()=>{
    console.log(`app is running on the port ${PORT}....`);
});
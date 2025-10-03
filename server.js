<<<<<<< HEAD
import express from "express";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoutes.js"
import { ConnectDB } from "./src/config/db.js";
import cors from "cors";


=======
import express from 'express';
import dotenv from 'dotenv';
import {ConnectDB} from './config/db.js'
import authRouter from './routes/authRoute.js';
import productsRoute from './routes/productRoute.js';
import cors from 'cors';

dotenv.config();
>>>>>>> eb40ef4 (first commit)
const app=express();

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","PATCH","DELETE"],
<<<<<<< HEAD
    Credential:true,
}))
dotenv.config();

// middleware
app.use(cors());
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
=======
    credentials:true,
}));


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const Port=process.env.PORT;
ConnectDB();
app.use('/api/auth',authRouter);
app.use("/api/products",productsRoute);

app.get("/",(req,res)=>{
    res.send("welcome homepage");
});

app.listen(Port,()=>{
    console.log(`server is running on port ${Port}`);
})
>>>>>>> eb40ef4 (first commit)

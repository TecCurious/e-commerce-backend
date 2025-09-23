import express from "express";
import dotenv from "dotenv";



const app=express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT=process.env.PORT;



app.get("/",(req,res)=>{
    res.send("server is running...");
});

app.listen(PORT,()=>{
    console.log(`app is running on the port ${PORT}....`);
});
import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js"
import cors from "cors";
const app = express();
dotenv.config();//load


const corsOptions={
    origin:"http://localhost:5173",
    methods:"GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials:true,
}

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT||8000;


app.use("/api/auth",authRouter);


app.get("/", (req, res) => {
  res.send("srver is running...");
});

app.listen(PORT, () => {
  console.log(`app is runnig on the port ${PORT}...`);
});

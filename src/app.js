import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js"
import { connectDB } from "./config/db/db.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT;


console.log(process.env.DB_PASSWORD);


//db connection
connectDB()

app.use("/api/auth",authRouter);


app.get("/", (req, res) => {
  res.send("srver is running...");
});

app.listen(PORT, () => {
  console.log(`app is runnig on the port ${PORT}...`);
});

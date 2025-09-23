
// import dotenv from "dotenv";
// dotenv.config();
import "dotenv/config";// user this aproch to laod env on entire application 
import express from "express"
import authRouter from "./routes/authRoutes.js"
import { connectDB } from "./config/db/db.js";

const app = express();


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

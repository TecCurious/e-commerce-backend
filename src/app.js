import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js"


const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT;



app.use("/api/auth",authRouter);
app.get("/", (req, res) => {
  res.send("srver is running...");
});

app.listen(PORT, () => {
  console.log(`app is runnig on the port ${PORT}...`);
});

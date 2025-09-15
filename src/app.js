import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js"
import pool from "./config/db/db.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT;


pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
  } else {
    console.log('✅ Database connected successfully!');
    release(); // release the client back to the pool
  }
});


app.use("/auth",authRouter);
app.get("/", (req, res) => {
  res.send("srver is running...");
});

app.listen(PORT, () => {
  console.log(`app is runnig on the port ${PORT}...`);
});

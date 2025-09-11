import express from "express";

const app = express();

const PORT = 8080;

app.get("/", (req, res) => {
  res.send("srver is running...");
});

app.listen(PORT, () => {
  console.log(`app is runnig on the port ${PORT}...`);
});

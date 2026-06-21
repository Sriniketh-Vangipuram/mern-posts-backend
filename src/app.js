const express = require("express");
const cors = require("cors");
const postRoutes=require("./routes/postRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-posts-frontend-seven.vercel.app"
    ]
  })
);

app.use(express.json());

app.use("/posts",postRoutes);

module.exports = app;
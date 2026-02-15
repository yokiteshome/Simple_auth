const express = require("express");
const { connectDB } = require("./config/db.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoutes = require("./routes/auth.route.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Simple Authentication API");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");
const errorMiddleware = require("./src/middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

/**
 * ✅ REQUIRED health check for Render
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.send("smfinance backend running");
});

app.use(errorMiddleware);

/**
 * ✅ MUST listen on process.env.PORT
 */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const routes = require("../../src/routes");
const errorMiddleware = require("../../src/middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * IMPORTANT:
 * DO NOT prefix with /api here
 */
app.use("/", routes);

app.use(errorMiddleware);

/**
 * Netlify handler
 */
module.exports.handler = serverless(app);

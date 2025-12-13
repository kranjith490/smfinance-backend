require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./src/routes');
const errorMiddleware = require('./src/middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.get('/', (req, res) => {
  res.send('smfinance backend running');
});

app.use(errorMiddleware);

module.exports = app;

// filepath: /Users/apple/Desktop/SMFINANCE/backend/src/utils/jwt.js
const jwt = require("jsonwebtoken");

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

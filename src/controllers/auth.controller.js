// filepath: /Users/apple/Desktop/SMFINANCE/backend/src/controllers/auth.controller.js
const AuthService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = req.user; // set by auth middleware
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

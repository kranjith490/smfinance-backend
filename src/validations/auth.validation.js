// filepath: /Users/apple/Desktop/SMFINANCE/backend/src/validations/auth.validation.js
const Joi = require("joi");

exports.registerValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "staff", "user").optional(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ success: false, message: error.message });
  next();
};

exports.loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ success: false, message: error.message });
  next();
};

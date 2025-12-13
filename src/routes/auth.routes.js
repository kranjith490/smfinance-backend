const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", registerValidation, AuthController.register);
router.post("/login", loginValidation, AuthController.login);
router.get("/me", authMiddleware, AuthController.me);

module.exports = router;

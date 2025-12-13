const router = require("express").Router();
const PaymentController = require("../controllers/payment.controller");

// router.get("/", PaymentController.list);
// router.get("/:id", CustomerController.getById);
router.post("/", PaymentController.addPayment);
// router.put("/:id", CustomerController.update);
// router.delete("/:id", CustomerController.remove);

module.exports = router;

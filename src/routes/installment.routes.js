const router = require("express").Router();
const InstallmentController = require("../controllers/installment.controller");
const auth = require("../middlewares/auth.middleware");

// router.get(
//   "/customers/:id/installments",
//   auth,
//   InstallmentController.getInstallmentsByCustomer
// );
router.get(
  "/customers/:id/installments",
  InstallmentController.getInstallmentsByCustomer
);
//router.put("/:id", auth, InstallmentController.updateInstallment);
router.put("/:id", auth, InstallmentController.updateInstallment);
router.get("/:id/penalty", auth, InstallmentController.getPenalty);
router.post("/:id/payment", InstallmentController.saveInstallmentPayment);

module.exports = router;

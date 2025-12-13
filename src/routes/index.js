const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/customers", require("./customer.routes"));
router.use("/installments", require("./installment.routes"));
router.use("/bills", require("./bill.routes"));
router.use("/payments", require("./payment.routes"));
router.use("/reports", require("./report.routes"));

module.exports = router;

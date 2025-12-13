const router = require("express").Router();
const BillController = require("../controllers/bill.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, BillController.create);
router.get("/:id", auth, BillController.getById);
router.get("/:id/pdf", auth, BillController.getPdf);

module.exports = router;

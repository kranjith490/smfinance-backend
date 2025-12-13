const router = require("express").Router();
const ReportController = require("../controllers/report.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/summary", auth, ReportController.summary);
router.get("/monthly", auth, ReportController.monthly);
router.get("/overdue", auth, ReportController.overdue);
router.get("/city-wise", auth, ReportController.cityWise);

module.exports = router;

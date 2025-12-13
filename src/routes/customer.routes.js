const router = require("express").Router();
const CustomerController = require("../controllers/customer.controller");

router.get("/due-today", CustomerController.getDueCustomers);
router.get("/", CustomerController.list);
router.get("/all", CustomerController.allList);
router.get("/:id", CustomerController.getById);
router.post("/", CustomerController.create);
router.put("/:id", CustomerController.update);
router.delete("/:id", CustomerController.remove);

module.exports = router;

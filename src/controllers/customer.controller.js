const CustomerService = require("../services/customer.service");
const CustomerRepo = require("../repositories/customer.repository");

exports.list = async (req, res, next) => {
  try {
    const { accountNo, name, city, mobile, page, limit } = req.query;
    const result = await CustomerService.list({
      accountNo,
      name,
      city,
      mobile,
      page,
      limit,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

exports.allList = async (req, res, next) => {
  try {
    const result = await CustomerRepo.allList();
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const result = await CustomerService.getById(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const result = await CustomerService.create(req.body);
    res.status(201).json({
      success: true,
      message: "Customer created successfully with installments",
      data: result,
    });
  } catch (err) {
    console.log("Error in creating customer:", err.message);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await CustomerService.update(req.params.id, req.body);
    res.json({
      success: true,
      message: "Customer updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.getDueCustomers = async (req, res) => {
  try {
    const result = await CustomerService.getDueCustomers();

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("Error fetching due customers:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching due customers",
    });
  }
};

exports.remove = async (req, res, next) => {
  try {
    await CustomerService.remove(req.params.id);
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const InstallmentService = require("../services/installment.service");

exports.getInstallmentsByCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, year } = req.query;
    const result = await InstallmentService.getInstallmentsByCustomer(id, {
      status,
      year,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.updateInstallment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await InstallmentService.updateInstallment(id, req.body);
    res.json({
      success: true,
      message: "Installment updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPenalty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { overdueDays, penaltyPerDay } = req.query;
    const result = await InstallmentService.getPenalty(id, {
      overdueDays,
      penaltyPerDay,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.saveInstallmentPayment = async (req, res, next) => {
  try {
    const { id } = req.params; // Installment ID
    const { penaltyAmount, totalAmount, paymentMode, paidDate } = req.body;

    const result = await InstallmentService.savePayment(id, {
      penaltyAmount,
      totalAmount,
      paymentMode,
      paidDate,
    });

    res.json({
      success: true,
      message: "Installment payment saved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

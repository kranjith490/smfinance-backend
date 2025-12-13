const BillService = require("../services/bill.service");

exports.create = async (req, res, next) => {
  try {
    const result = await BillService.create(req.body);
    res.status(201).json({
      success: true,
      message: "Bill generated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const result = await BillService.getById(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.getPdf = async (req, res, next) => {
  try {
    const pdfBuffer = await BillService.generatePdf(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="BILL-${req.params.id}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

exports.getCustomerBills = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { year, page, limit } = req.query;
    const result = await BillService.getCustomerBills(id, {
      year,
      page,
      limit,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

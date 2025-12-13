const ReportService = require("../services/report.service");

exports.summary = async (req, res, next) => {
  try {
    const result = await ReportService.getSummary();
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.monthly = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await ReportService.getMonthlyReport({ month, year });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.overdue = async (req, res, next) => {
  try {
    const { minDays } = req.query;
    const result = await ReportService.getOverdueReport({ minDays });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

exports.cityWise = async (req, res, next) => {
  try {
    const result = await ReportService.getCityWiseReport();
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
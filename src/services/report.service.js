const ReportRepo = require("../repositories/report.repository");

exports.getSummary = async () => {
  const summary = await ReportRepo.fetchSummary();
  return {
    totalCustomers: summary.totalCustomers,
    activeCustomers: summary.activeCustomers,
    totalAmountFinanced: summary.totalAmountFinanced,
    totalHPAmount: summary.totalHPAmount,
    totalCollected: summary.totalCollected,
    totalPending: summary.totalPending,
    collectionRate: (
      (summary.totalCollected / summary.totalHPAmount) *
      100
    ).toFixed(2),
    overdueCount: summary.overdueCount,
  };
};

exports.getMonthlyReport = async ({ month, year }) => {
  const report = await ReportRepo.fetchMonthlyReport({ month, year });
  return {
    month: report.month,
    year: report.year,
    totalDue: report.totalDue,
    totalCollected: report.totalCollected,
    totalPending: report.totalPending,
    collectionRate: ((report.totalCollected / report.totalDue) * 100).toFixed(
      2
    ),
    paymentModeBreakdown: report.paymentModeBreakdown,
    dailyCollection: report.dailyCollection,
  };
};

exports.getOverdueReport = async ({ minDays }) => {
  const { overdueDetails, summary } = await ReportRepo.fetchOverdueReport({
    minDays,
  });
  return {
    data: overdueDetails,
    summary: {
      totalOverdue: summary.totalOverdue,
      totalOverdueAmount: summary.totalOverdueAmount,
    },
  };
};

exports.getCityWiseReport = async () => {
  const cityWiseData = await ReportRepo.fetchCityWiseReport();
  return cityWiseData.map((city) => ({
    city: city.city,
    customerCount: city.customerCount,
    totalFinanced: city.totalFinanced,
    totalCollected: city.totalCollected,
    collectionRate: ((city.totalCollected / city.totalFinanced) * 100).toFixed(
      2
    ),
  }));
};

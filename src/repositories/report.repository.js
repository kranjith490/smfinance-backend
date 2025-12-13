const db = require("../config/db");

exports.fetchSummary = async () => {
  const [rows] = await db.query(`
    SELECT 
      COUNT(*) AS totalCustomers,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeCustomers,
      SUM(amount_financed) AS totalAmountFinanced,
      SUM(hp_amount) AS totalHPAmount,
      SUM(collected_amount) AS totalCollected,
      SUM(hp_amount - collected_amount) AS totalPending,
      SUM(CASE WHEN overdue_days > 0 THEN 1 ELSE 0 END) AS overdueCount
    FROM customers
  `);
  return rows[0];
};

exports.fetchMonthlyReport = async ({ month, year }) => {
  const [rows] = await db.query(
    `
    SELECT 
      SUM(total_amount) AS totalDue,
      SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) AS totalCollected,
      SUM(CASE WHEN status = 'pending' THEN total_amount ELSE 0 END) AS totalPending
    FROM bills
    WHERE MONTH(payment_date) = ? AND YEAR(payment_date) = ?
  `,
    [month, year]
  );

  const [paymentModeRows] = await db.query(
    `
    SELECT payment_mode AS mode, SUM(total_amount) AS amount
    FROM bills
    WHERE MONTH(payment_date) = ? AND YEAR(payment_date) = ?
    GROUP BY payment_mode
  `,
    [month, year]
  );

  const [dailyCollectionRows] = await db.query(
    `
    SELECT DATE(payment_date) AS date, SUM(total_amount) AS amount
    FROM bills
    WHERE MONTH(payment_date) = ? AND YEAR(payment_date) = ?
    GROUP BY DATE(payment_date)
  `,
    [month, year]
  );

  return {
    ...rows[0],
    paymentModeBreakdown: paymentModeRows.reduce((acc, row) => {
      acc[row.mode] = row.amount;
      return acc;
    }, {}),
    dailyCollection: dailyCollectionRows,
  };
};

exports.fetchOverdueReport = async ({ minDays }) => {
  const [overdueRows] = await db.query(
    `
    SELECT 
      c.id AS customerId,
      c.account_no AS accountNo,
      c.name AS customerName,
      c.mobile,
      i.installment_number AS installmentNo,
      i.due_date AS dueDate,
      DATEDIFF(NOW(), i.due_date) AS overdueDays,
      i.amount,
      (DATEDIFF(NOW(), i.due_date) * i.penalty_per_day) AS estimatedPenalty
    FROM installments i
    JOIN customers c ON i.customer_id = c.id
    WHERE DATEDIFF(NOW(), i.due_date) >= ?
  `,
    [minDays]
  );

  const [summaryRows] = await db.query(
    `
    SELECT 
      COUNT(*) AS totalOverdue,
      SUM(amount + (DATEDIFF(NOW(), due_date) * penalty_per_day)) AS totalOverdueAmount
    FROM installments
    WHERE DATEDIFF(NOW(), due_date) >= ?
  `,
    [minDays]
  );

  return {
    overdueDetails: overdueRows,
    summary: summaryRows[0],
  };
};

exports.fetchCityWiseReport = async () => {
  const [rows] = await db.query(`
    SELECT 
      city,
      COUNT(*) AS customerCount,
      SUM(amount_financed) AS totalFinanced,
      SUM(collected_amount) AS totalCollected
    FROM customers
    GROUP BY city
  `);
  return rows;
};

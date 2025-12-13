const db = require("../config/db");

exports.create = async (data) => {
  const {
    billNo,
    customerId,
    customerName,
    accountNo,
    installmentId,
    installmentNo,
    installmentAmount,
    penaltyAmount,
    totalAmount,
    paymentMode,
    paymentDate,
    receivedBy,
  } = data;

  const [result] = await db.query(
    `INSERT INTO bills 
    (bill_no, customer_id, customer_name, account_no, installment_id, installment_number, 
    installment_amount, penalty_amount, total_amount, payment_mode, payment_date, received_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      billNo,
      customerId,
      customerName,
      accountNo,
      installmentId,
      installmentNo,
      installmentAmount,
      penaltyAmount,
      totalAmount,
      paymentMode,
      paymentDate,
      receivedBy,
    ]
  );

  return { id: result.insertId, createdAt: new Date().toISOString() };
};

exports.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM bills WHERE id = ?", [id]);
  return rows[0];
};

exports.getCustomerBills = async (customerId, { year, page, limit }) => {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    `SELECT id, bill_no AS billNo, installment_number AS installmentNo, 
    total_amount AS totalAmount, payment_date AS paymentDate, payment_mode AS paymentMode 
    FROM bills 
    WHERE customer_id = ? AND YEAR(payment_date) = ? 
    LIMIT ? OFFSET ?`,
    [customerId, year, parseInt(limit, 10), offset]
  );

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM bills WHERE customer_id = ? AND YEAR(payment_date) = ?`,
    [customerId, year]
  );

  return { bills: rows, total: countRows[0].total };
};

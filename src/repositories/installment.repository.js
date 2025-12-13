const db = require("../config/db");

exports.addInstallments = async (installments) => {
  const values = installments.map(
    (inst) =>
      `('${inst.id}', '${inst.customer_id}', ${inst.installment_number}, ${inst.installment_amount}, '${inst.due_date}')`
  );

  const query = `
    INSERT INTO installments (id, customer_id, installment_number, installment_amount, due_date)
    VALUES ${values.join(", ")}
  `;

  await db.query(query);
};

exports.getInstallmentsByCustomer = async (customerId) => {
  const [rows] = await db.query(
    `
    SELECT 
      id,
      installment_number AS installmentNo,
      DATE_FORMAT(due_date, '%d-%m-%Y') AS dueDate,
      status,
      DATE_FORMAT(paid_date, '%d-%m-%Y') AS paidDate,
      installment_amount AS installmentAmount,
      paid_amount AS amountPaid,
      penalty_paid AS penaltyPaid,

      -- Overdue days only if not paid and due date is before today
      CASE 
        WHEN status = 'paid' THEN 0
        WHEN due_date >= CURDATE() THEN 0
        ELSE DATEDIFF(CURDATE(), due_date)
      END AS overDueDayCount

    FROM installments
    WHERE customer_id = ?
    ORDER BY installment_number ASC
    `,
    [customerId]
  );
  return rows;
};

exports.updateInstallment = async (installmentId, data) => {
  const { paid_amount, status, paid_date, penalty_paid, total_paid_amount } =
    data;

  console.log(
    "Updating installment:",
    installmentId,
    paid_amount,
    status,
    paid_date
  );

  const query = `
    UPDATE installments
    SET paid_amount = ?, status = ?, paid_date = ?, penalty_paid = ?, total_paid_amount = ?
    WHERE id = ?
  `;

  await db.query(query, [
    paid_amount,
    status,
    paid_date,
    penalty_paid,
    total_paid_amount,
    installmentId,
  ]);
};

exports.getInstallmentById = async (installmentId) => {
  const [rows] = await db.query(
    `
    SELECT id, customer_id, installment_number, installment_amount, paid_amount, status, due_date
    FROM installments
    WHERE id = ?
    `,
    [installmentId]
  );
  return rows[0];
};

exports.saveInstallmentPayment = async (installmentId, paymentDetails) => {
  const { penaltyAmount, totalAmount, paymentMode, paidDate } = paymentDetails;
  await db.query(
    `
    UPDATE installments 
    SET status = 'Paid', paid_date = ?, payment_mode = ?, penalty_amount = ?, total_amount = ? 
    WHERE id = ?
    `,
    [paidDate, paymentMode, penaltyAmount, totalAmount, installmentId]
  );
  const [rows] = await db.query(
    `
    SELECT 
      id, installment_number AS installmentNo, DATE_FORMAT(due_date, '%d-%m-%Y') AS dueData , status, 
      paid_date AS paidDate, payment_mode AS paymentMode, 
      penalty_amount AS penaltyAmount, total_amount AS totalAmount
    FROM installments
    WHERE id = ?
    `,
    [installmentId]
  );
  return rows[0];
};

// repositories/installment.repository.js

exports.areAllInstallmentsPaid = async (customerId) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS pendingCount
    FROM installments
    WHERE customer_id = ? AND status != 'paid'
    `,
    [customerId]
  );

  return rows[0].pendingCount === 0;
};

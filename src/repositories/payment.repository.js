const db = require("../config/db");

exports.addPayment = async (payment) => {
  const {
    id,
    customer_id,
    installment_id,
    amount_paid,
    payment_date,
    payment_mode,
    notes,
  } = payment;

  const query = `
      INSERT INTO payments (id, customer_id, installment_id, amount_paid, payment_date, payment_mode, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  await db.query(query, [
    id,
    customer_id,
    installment_id,
    amount_paid,
    payment_date,
    payment_mode,
    notes,
  ]);

  return payment;
};

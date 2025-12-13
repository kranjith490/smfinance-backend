const db = require("../config/db");

exports.list = async ({ accountNo, name, city, mobile, page, limit }) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      c.id AS id,
      c.account_no AS accountNo,
      c.name AS name,
      c.father_name AS fatherName,
      c.address AS address,
      c.city AS city,
      c.mobile AS mobile,
      c.aadhar_no AS aadharNo,
      c.guarantor_name AS guarantorName,
      c.guarantor_mobile AS guarantorMobile,
      c.guarantor_address AS guarantorAddress,
      c.vehicle_no AS vehicleNo,
      c.vehicle_name AS vehicleName,
      c.engine_no AS engineNo,
      c.chassis_no AS chassisNo,
      c.amount_financed AS amountFinanced,
      c.no_of_installments AS noOfInstallments,
      c.installment_amount AS installmentAmount,
      c.interest_rate AS interestRate,
      c.start_date AS startDate,
      c.created_at AS createdAt,  

      -- Total installments assigned
      (SELECT COUNT(*) FROM installments i WHERE i.customer_id = c.id) 
      AS installmentCount,

      -- Completed installments
      (SELECT COUNT(*) FROM installments i WHERE i.customer_id = c.id AND i.status = 'paid')
      AS installmentCompleted,

      -- Total amount paid so far
      (SELECT SUM(i.installment_amount) FROM installments i WHERE i.customer_id = c.id AND i.status = 'paid')
      AS totalAmountPaid

    FROM customers c
    WHERE c.active = 'A'
      AND (? IS NULL OR c.account_no LIKE ?)
      AND (? IS NULL OR c.name LIKE ?)
      AND (? IS NULL OR c.city LIKE ?)
      AND (? IS NULL OR c.mobile LIKE ?)
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const params = [
    accountNo,
    `%${accountNo}%`,
    name,
    `%${name}%`,
    city,
    `%${city}%`,
    mobile,
    `%${mobile}%`,
    parseInt(limit, 10),
    offset,
  ];

  const [rows] = await db.query(query, params);

  // Count total active matching customers
  const [countRows] = await db.query(
    `
    SELECT COUNT(*) AS total FROM customers c
    WHERE c.active = 'A'
      AND (? IS NULL OR c.account_no LIKE ?)
      AND (? IS NULL OR c.name LIKE ?)
      AND (? IS NULL OR c.city LIKE ?)
      AND (? IS NULL OR c.mobile LIKE ?)
    `,
    [
      accountNo,
      `%${accountNo}%`,
      name,
      `%${name}%`,
      city,
      `%${city}%`,
      mobile,
      `%${mobile}%`,
    ]
  );

  return { customers: rows, total: countRows[0].total };
};

exports.allList = async () => {
  const [rows] = await db.query(
    `
    SELECT 
      id, account_no AS accountNo, name, father_name AS fatherName, address, city, 
      mobile, aadhar_no AS aadharNo, guarantor_name AS guarantorName, 
      guarantor_mobile AS guarantorMobile, guarantor_address AS guarantorAddress, 
      vehicle_no AS vehicleNo, vehicle_name AS vehicleName, engine_no AS engineNo, 
      chassis_no AS chassisNo, amount_financed AS amountFinanced, 
      no_of_installments AS noOfInstallments, 
      interest_rate AS interestRate,
      installment_amount AS installmentAmount, start_date AS startDate, 
      created_at AS createdAt
    FROM customers
    WHERE active = 'A'
    ORDER BY created_at DESC
    `
  );

  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT 
      id, account_no AS accountNo, name, father_name AS fatherName, address, city, 
      mobile, aadhar_no AS aadharNo, guarantor_name AS guarantorName, 
      guarantor_mobile AS guarantorMobile, guarantor_address AS guarantorAddress, 
      vehicle_no AS vehicleNo, vehicle_name AS vehicleName, engine_no AS engineNo, 
      chassis_no AS chassisNo, amount_financed AS amountFinanced, 
      no_of_installments AS noOfInstallments, hp_amount AS hpAmount, 
      installment_amount AS installmentAmount, start_date AS startDate, 
      created_at AS createdAt
    FROM customers
    WHERE id = ?
  `,
    [id]
  );
  return rows[0];
};

async function generateNextHpNumber() {
  const [rows] = await db.query(`
      SELECT account_no 
      FROM customers
      WHERE account_no LIKE 'HP%'
      ORDER BY CAST(SUBSTRING(account_no, 3) AS UNSIGNED) DESC
      LIMIT 1
  `);

  if (rows.length === 0) return "HP1";

  const lastHp = rows[0].account_no; // e.g. "HP9"
  const number = parseInt(lastHp.replace("HP", ""), 10) + 1;

  return "HP" + number; // Eg: HP10
}

exports.create = async (customerData) => {
  const {
    id,
    account_no,
    name,
    father_name,
    address,
    city,
    mobile,
    aadhar_no,
    guarantor_name,
    guarantor_father_name,
    guarantor_mobile,
    guarantor_address,
    vehicle_no,
    vehicle_name,
    engine_no,
    chassis_no,
    make,
    model,
    amount_financed,
    no_of_installments,
    interest_rate,
    hp_amount,
    installment_amount,
    start_date,
  } = customerData;

  // If HP number is not passed → generate new
  let finalHpNumber = account_no;
  if (!finalHpNumber || finalHpNumber.trim() === "") {
    finalHpNumber = await generateNextHpNumber();
  }

  let updatedAccountNumber = finalHpNumber;

  const sql = `
    INSERT INTO customers (
      id, account_no, name, father_name, address, city, mobile, aadhar_no,
      guarantor_name, guarantor_father_name, guarantor_mobile, guarantor_address,
      vehicle_no, vehicle_name, engine_no, chassis_no, make, model,
      amount_financed, no_of_installments, interest_rate,
      hp_amount, installment_amount, start_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id,
    updatedAccountNumber,
    name,
    father_name,
    address,
    city,
    mobile,
    aadhar_no,
    guarantor_name,
    guarantor_father_name,
    guarantor_mobile,
    guarantor_address,
    vehicle_no,
    vehicle_name,
    engine_no,
    chassis_no,
    make,
    model,
    amount_financed,
    no_of_installments,
    interest_rate,
    hp_amount,
    installment_amount,
    start_date,
  ];

  const [result] = await db.query(sql, values);
  return result;
};

// Assumes `db` is your mysql2/promise connection instance (same as before)
exports.update = async (id, data) => {
  // destructure allowed fields from incoming `data`
  const {
    name,
    father_name,
    address,
    mobile,
    aadhar_no,
    guarantor_name,
    guarantor_mobile,
    guarantor_address,
    vehicle_no,
    vehicle_name,
    engine_no,
    chassis_no,
    guarantor_father_name,
    make,
    model,
  } = data;

  // Build the parameter array in the same order as placeholders below
  const params = [
    name ?? null,
    father_name ?? null,
    address ?? null,
    mobile ?? null,
    aadhar_no ?? null,
    guarantor_name ?? null,
    guarantor_mobile ?? null,
    guarantor_address ?? null,
    vehicle_no ?? null,
    vehicle_name ?? null,
    engine_no ?? null,
    chassis_no ?? null,
    guarantor_father_name ?? null,
    make ?? null,
    model ?? null,
    id, // last placeholder is for WHERE id = ?
  ];

  try {
    // NOTE: removed the extra comma before WHERE and ensured placeholder count matches params
    const updateSql = `
      UPDATE customers
      SET
        name = ?,
        father_name = ?,
        address = ?,
        mobile = ?,
        aadhar_no = ?,
        guarantor_name = ?,
        guarantor_mobile = ?,
        guarantor_address = ?,
        vehicle_no = ?,
        vehicle_name = ?,
        engine_no = ?,
        chassis_no = ?,
        guarantor_father_name = ?,
        make = ?,
        model = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await db.query(updateSql, params);

    // Return the updated row (select fresh)
    const [rows] = await db.query(
      `SELECT id, name, father_name, address, mobile, aadhar_no, guarantor_name,
              guarantor_mobile, guarantor_address, vehicle_no, vehicle_name,
              engine_no, chassis_no, guarantor_father_name, make, model, updated_at
       FROM customers
       WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  } catch (err) {
    // Re-throw so caller can handle/log it, or you can return a custom error object
    console.error("Customer update failed:", err);
    throw err;
  }
};

exports.getDueCustomers = async () => {
  const [rows] = await db.query(`
      SELECT 
        id,
        account_no,
        name,
        mobile,
        start_date,
        no_of_installments,
        
        TIMESTAMPDIFF(MONTH, start_date, CURDATE()) AS months_passed,

        DATE_ADD(start_date, INTERVAL TIMESTAMPDIFF(MONTH, start_date, CURDATE()) MONTH) 
          AS next_due_date,

        (no_of_installments - TIMESTAMPDIFF(MONTH, start_date, CURDATE())) 
          AS pending_installments

      FROM customers
      WHERE 
          DATE_ADD(start_date, INTERVAL TIMESTAMPDIFF(MONTH, start_date, CURDATE()) MONTH) = CURDATE()
          AND (no_of_installments - TIMESTAMPDIFF(MONTH, start_date, CURDATE())) > 0
  `);

  return rows;
};

exports.updateCustomerStatus = async (customerId, status) => {
  await db.query(
    `UPDATE customers 
     SET status = ?, updated_at = NOW() 
     WHERE id = ?`,
    [status, customerId]
  );
};

exports.remove = async (id) => {
  await db.query(
    "UPDATE customers SET active = 'D', updated_at = NOW() WHERE id = ?",
    [id]
  );
};

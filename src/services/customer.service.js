const { parse } = require("dotenv");
const CustomerRepo = require("../repositories/customer.repository");
const InstallmentRepo = require("../repositories/installment.repository");
const { v4: uuidv4 } = require("uuid");

exports.list = async (filters) => {
  const { accountNo, name, city, mobile, page, limit } = filters;
  const { customers, total } = await CustomerRepo.list({
    accountNo,
    name,
    city,
    mobile,
    page,
    limit,
  });

  return {
    data: customers,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.allList = async () => {
  const { customers, total } = await CustomerRepo.allList();
  return {
    count: total,
    customers,
  };
};

exports.getById = async (id) => {
  const customer = await CustomerRepo.getById(id);
  if (!customer) throw new Error("Customer not found");

  const installments = await InstallmentRepo.getInstallmentsByCustomer(id);
  return { ...customer, installments };
};

exports.create = async (data) => {
  const {
    accountNo,
    name,
    fatherName,
    address,
    city,
    mobile,
    aadharNo,
    guarantorName,
    guarantorFatherName,
    guarantorMobile,
    guarantorAddress,
    vehicleNo,
    vehicleName,
    engineNo,
    chassisNo,
    make,
    model,
    amountFinanced,
    noOfInstallments,
    interestRate,
    startDate,
  } = data;

  // Calculate installment
  const totalAmount =
    parseFloat(amountFinanced) +
    parseFloat((parseFloat(amountFinanced) * interestRate) / 100);

  const installmentAmount = (totalAmount / noOfInstallments).toFixed(2);

  const customerId = uuidv4();

  // Insert into customer table
  const customer = await CustomerRepo.create({
    id: customerId,
    account_no: accountNo,
    name,
    father_name: fatherName,
    address,
    city,
    mobile,
    aadhar_no: aadharNo,
    guarantor_name: guarantorName,
    guarantor_mobile: guarantorMobile,
    guarantor_address: guarantorAddress,
    vehicle_no: vehicleNo,
    vehicle_name: vehicleName,
    engine_no: engineNo,
    chassis_no: chassisNo,
    amount_financed: amountFinanced,
    no_of_installments: noOfInstallments,
    interest_rate: interestRate,
    hp_amount: totalAmount,
    installment_amount: installmentAmount,
    start_date: startDate,
    guarantor_father_name: guarantorFatherName,
    make,
    model,
  });

  // Prepare installments
  const installments = [];
  for (let i = 1; i <= noOfInstallments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    installments.push({
      id: uuidv4(),
      customer_id: customerId,
      installment_number: i,
      installment_amount: installmentAmount,
      due_date: dueDate.toISOString().split("T")[0],
    });
  }

  // Insert installments
  await InstallmentRepo.addInstallments(installments);

  return { customer, installments };
};

exports.update = async (id, data) => {
  const {
    name,
    fatherName,
    address,
    city,
    mobile,
    aadharNo,
    guarantorName,
    guarantorFatherName,
    guarantorMobile,
    guarantorAddress,
    vehicleNo,
    vehicleName,
    engineNo,
    chassisNo,
    make,
    model,
  } = data;
  const updatedCustomer = await CustomerRepo.update(id, {
    name,
    father_name: fatherName,
    address,
    city,
    mobile,
    aadhar_no: aadharNo,
    guarantor_name: guarantorName,
    guarantor_father_name: guarantorFatherName,
    guarantor_mobile: guarantorMobile,
    guarantor_address: guarantorAddress,
    vehicle_no: vehicleNo,
    vehicle_name: vehicleName,
    engine_no: engineNo,
    chassis_no: chassisNo,
    make,
    model,
  });
  return { id: updatedCustomer.id, name: updatedCustomer.name };
};

exports.getDueCustomers = async () => {
  const dueCustomers = await CustomerRepo.getDueCustomers();

  return {
    date: new Date().toISOString().split("T")[0],
    count: dueCustomers.length,
    data: dueCustomers,
  };
};

exports.remove = async (id) => {
  await CustomerRepo.remove(id);
};

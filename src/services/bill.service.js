const BillRepo = require("../repositories/bill.repository");
const CustomerRepo = require("../repositories/customer.repository");
const InstallmentRepo = require("../repositories/installment.repository");
const { generateBillNumber } = require("../utils/bill.utils");

exports.create = async (data) => {
  const customer = await CustomerRepo.getById(data.customerId);
  if (!customer) throw new Error("Customer not found");

  const installment = await InstallmentRepo.getInstallmentById(
    data.installmentId
  );
  if (!installment) throw new Error("Installment not found");

  const billNo = generateBillNumber();
  const bill = await BillRepo.create({
    ...data,
    billNo,
    customerName: customer.name,
    accountNo: customer.accountNo,
    installmentNo: installment.installmentNo,
  });

  return {
    id: bill.id,
    billNo,
    customerId: customer.id,
    customerName: customer.name,
    accountNo: customer.accountNo,
    installmentNo: installment.installmentNo,
    ...data,
    createdAt: bill.createdAt,
  };
};

exports.getById = async (id) => {
  const bill = await BillRepo.getById(id);
  if (!bill) throw new Error("Bill not found");

  const customer = await CustomerRepo.getById(bill.customerId);
  return {
    ...bill,
    customer: {
      id: customer.id,
      accountNo: customer.accountNo,
      name: customer.name,
      mobile: customer.phone,
    },
  };
};

exports.generatePdf = async (id) => {
  const bill = await this.getById(id);
  // Generate PDF logic here (e.g., using a library like pdfkit)
  return Buffer.from("PDF content here"); // Replace with actual PDF generation logic
};

exports.getCustomerBills = async (customerId, { year, page, limit }) => {
  const { bills, total } = await BillRepo.getCustomerBills(customerId, {
    year,
    page,
    limit,
  });

  return {
    data: bills,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
    },
  };
};

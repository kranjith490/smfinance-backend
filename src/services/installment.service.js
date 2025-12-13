const InstallmentRepo = require("../repositories/installment.repository");

exports.getInstallmentsByCustomer = async (customerId, filters) => {
  return await InstallmentRepo.getInstallmentsByCustomer(customerId, filters);
};

exports.updateInstallment = async (installmentId, data) => {
  const updatedInstallment = await InstallmentRepo.updateInstallment(
    installmentId,
    data
  );
  return { id: updatedInstallment.id, status: updatedInstallment.status };
};

exports.getPenalty = async (installmentId, { overdueDays, penaltyPerDay }) => {
  const installment = await InstallmentRepo.getInstallmentById(installmentId);
  if (!installment) throw new Error("Installment not found");

  const penaltyAmount = overdueDays * penaltyPerDay;
  const totalAmount = installment.amount + penaltyAmount;

  return {
    installmentId: installment.id,
    installmentAmount: installment.amount,
    dueDate: installment.dueDate,
    overdueDays: parseInt(overdueDays, 10),
    penaltyPerDay: parseInt(penaltyPerDay, 10),
    penaltyAmount,
    totalAmount,
  };
};

exports.savePayment = async (id, paymentDetails) => {
  const { penaltyAmount, totalAmount, paymentMode, paidDate } = paymentDetails;

  // Update the installment with payment details
  const updatedInstallment = await Installment.update(
    {
      penalty_amount: penaltyAmount,
      total_amount: totalAmount,
      payment_mode: paymentMode,
      paid_date: paidDate,
      status: "Paid",
    },
    { where: { id } }
  );

  if (!updatedInstallment[0]) {
    throw new Error("Installment not found or update failed");
  }

  return await Installment.findByPk(id); // Return the updated installment
};

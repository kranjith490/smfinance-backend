const PaymentRepo = require("../repositories/payment.repository");
const InstallmentRepo = require("../repositories/installment.repository");
const CustomerRepo = require("../repositories/customer.repository");

const { randomUUID } = require("crypto");


exports.addPayment = async (req, res, next) => {
  try {
    const {
      customerId,
      installmentId,
      amountPaid,
      penaltyAmount,
      paymentDate,
      paymentMode,
      notes,
    } = req.body;

    const installment = await InstallmentRepo.getInstallmentById(installmentId);

    if (installment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Installment is already paid and completed",
      });
    }

    // 1. Add Payment
    const payment = await PaymentRepo.addPayment({
      id: randomUUID(),
      customer_id: customerId,
      installment_id: installmentId,
      amount_paid: amountPaid,
      payment_date: paymentDate,
      payment_mode: paymentMode,
      notes,
    });

    // 2. Update installment amounts
    const newPaidAmount = parseFloat(installment.paid_amount) + amountPaid;
    const totalAmountPaid =
      parseFloat(newPaidAmount) + parseFloat(penaltyAmount);

    const status =
      newPaidAmount >= installment.installment_amount
        ? "paid"
        : newPaidAmount > 0
        ? "partial"
        : "pending";

    await InstallmentRepo.updateInstallment(installmentId, {
      paid_amount: newPaidAmount,
      penalty_paid: penaltyAmount,
      total_paid_amount: totalAmountPaid,
      status,
      paid_date: paymentDate,
    });

    // 3. CHECK IF ALL INSTALLMENTS ARE PAID
    const isLoanClosed = await InstallmentRepo.areAllInstallmentsPaid(
      customerId
    );

    if (isLoanClosed) {
      await CustomerRepo.updateCustomerStatus(customerId, "CLOSED");
    }

    return res.status(201).json({
      success: true,
      message: isLoanClosed
        ? "Payment added & Loan Closed successfully"
        : "Payment added successfully",
      loanClosed: isLoanClosed,
      data: { payment },
    });
  } catch (err) {
    next(err);
  }
};

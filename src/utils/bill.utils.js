let billCounter = 1234; // Example starting point, replace with database logic if needed

exports.generateBillNumber = () => {
  const year = new Date().getFullYear();
  const billNo = `BILL-${year}-${String(billCounter).padStart(6, "0")}`;
  billCounter++;
  return billNo;
};

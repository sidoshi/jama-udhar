export const toLocaleRupeeString = (amount: number) => {
  if (amount == null || isNaN(amount)) {
    return "₹0";
  }

  const absAmount = Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${amount < 0 ? "-" : ""} ₹${absAmount}`;
};

export const DATE_FORMAT = "YYYY-MM-DD";

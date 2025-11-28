export const toLocaleRupeeString = (amount: number) => {
  const absAmount = Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? "-" : ""} ₹${absAmount}`;
};

export const DATE_FORMAT = "YYYY-MM-DD";

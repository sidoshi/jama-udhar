export const toLocaleRupeeString = (amount: number) => {
  const absAmount = Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `₹${absAmount}`;
};

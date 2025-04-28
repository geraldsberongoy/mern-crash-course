/**
 * Middleware to calculate the updated price based on discount
 * This runs before a product is saved to the database
 */
const updatePriceMiddleware = function (next) {
  // Ensure price and discount are valid numbers
  if (typeof this.price !== "number") {
    this.price = parseFloat(this.price) || 0;
  }

  if (typeof this.discount !== "number") {
    this.discount = parseFloat(this.discount) || 0;
  }

  // Ensure discount is capped between 0-100%
  this.discount = Math.max(0, Math.min(100, this.discount));

  // Calculate the discounted price with precision handling
  if (this.discount) {
    const discountAmount = (this.price * this.discount) / 100;
    this.updatedPrice = parseFloat((this.price - discountAmount).toFixed(2));
  } else {
    this.updatedPrice = this.price;
  }

  next();
};

export default updatePriceMiddleware;

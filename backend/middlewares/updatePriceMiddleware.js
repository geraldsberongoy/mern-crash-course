const updatePriceMiddleware = function (next) {
  this.updatedPrice = this.discount
    ? this.price - (this.price * this.discount) / 100
    : this.price;
  next();
};

export default updatePriceMiddleware;

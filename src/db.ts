type Prices = {
  [productId: string]: number;
};

/*
  Simple 'fake' db implementation, which stores lowest price for each product (referenced by productId)
 */
export class PriceDB {
  private prices: Prices = {};

  getPrice = (productId: string): number | undefined => {
    return this.prices[productId];
  };

  setPrice = (productId: string, price: number): void => {
    this.prices[productId] = price;
  };
}

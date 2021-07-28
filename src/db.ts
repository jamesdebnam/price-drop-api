type Prices = {
  [productId: string]: number;
};

/*
  Simple 'fake' db implementation, which stores lowest price for each product (referenced by productId)
 */
export class PriceDB {
  readonly prices: Prices;

  constructor(prices = {}) {
    this.prices = prices;
  }

  getPrice = (productId: string): number | undefined => {
    return this.prices[productId];
  };

  setPrice = (productId: string, price: number): void => {
    this.prices[productId] = price;
  };
}

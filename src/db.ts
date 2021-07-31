export type Prices = {
  [productId: string]: number;
};

/*
  Simple 'fake' db implementation, which stores lowest price for each product (referenced by productId)
 */
export class PriceDB {
  private prices: Prices;

  constructor(prices: Prices = {}) {
    this.prices = prices;
  }

  getPrice = (productId: string): number | undefined => {
    return this.prices[productId];
  };

  setPrice = (productId: string, price: number): void => {
    this.prices[productId] = price;
  };

  // Used for testing
  seedPrices = (seed: Prices) => {
    this.prices = seed;
  };

  // Used for testing
  clearPrices = () => {
    this.prices = {};
  };
}

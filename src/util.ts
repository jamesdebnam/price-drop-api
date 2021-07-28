type RetailerPrice = {
  retailerId: string;
  retailPrice: number;
  isInStock: boolean;
  discountPrice?: number;
};

type PriceArray = RetailerPrice[];

type LowestPriceResult = {
  price: number;
  retailerId: string;
};

export function findLowestPrice(priceArray: PriceArray): LowestPriceResult {
  let lowestPrice: LowestPriceResult;

  priceArray.forEach(
    ({ retailerId, retailPrice, isInStock, discountPrice }) => {
      if (!isInStock) return;

      const comparePrice = discountPrice || retailPrice;

      if (!lowestPrice || comparePrice < lowestPrice.price) {
        lowestPrice = { price: comparePrice, retailerId };
      }
    }
  );

  return lowestPrice;
}

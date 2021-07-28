import express, { Request, Response } from "express";
import { validate, validatePriceDrop } from "./validations";
import { PriceDB } from "./db";
import { findLowestPrice } from "./util";

const db = new PriceDB();

type PriceDropResult = {
  alertRequired: boolean;
  newPrice?: number;
  retailerId?: string;
  productId?: string;
};

function getRoutes() {
  const router = express.Router();

  router.get(
    "/pricedrop",
    validate(validatePriceDrop),
    async (req: Request, res: Response<PriceDropResult>) => {
      const { retailers, productId } = req.body;
      const lowestPrice = findLowestPrice(retailers);
      const savedPrice = db.getPrice(productId);
      db.setPrice(productId, lowestPrice.price);

      if (savedPrice) {
        const diff = savedPrice - lowestPrice.price;
        if (diff > 10) {
          return res.send({
            alertRequired: true,
            newPrice: lowestPrice.price,
            retailerId: lowestPrice.retailerId,
            productId,
          });
        }
      }

      return res.send({ alertRequired: false });
    }
  );

  return router;
}

export { getRoutes };

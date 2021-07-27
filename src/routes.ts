import express, { Request, Response } from "express";
import { validate, validatePriceDrop } from "./validations";
import { PriceDB } from "./db";

const db = new PriceDB();

function getRoutes() {
  const router = express.Router();

  router.get(
    "/pricedrop",
    validate(validatePriceDrop),
    async (req: Request, res: Response) => {
      return res.send("hello!");
    }
  );

  return router;
}

export { getRoutes };

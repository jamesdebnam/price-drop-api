import Joi, { ObjectSchema } from "joi";

import { Request, Response, NextFunction } from "express";
import { ApiError } from "./middlewares";
import httpStatus from "http-status";
import { pickKeys } from "./util";

/**
 * Takes in a Joi object schema, and throws an Api error if the request
 * is not valid
 * @param schema
 */
export function validate(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = Joi.compile(schema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };
}

// I've made the assumption that we need at least one price in the request
// so I don't need to worry about it later
export const validatePriceDrop = Joi.object({
  productId: Joi.string(),
  retailers: Joi.array()
    .items(
      Joi.object({
        retailerId: Joi.string().required(),
        retailPrice: Joi.number().required(),
        isInStock: Joi.boolean().required(),
        discountPrice: Joi.number(),
      })
    )
    .min(1),
});

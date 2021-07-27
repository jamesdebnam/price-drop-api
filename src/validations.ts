import Joi, { ObjectSchema } from "joi";

import { Request, Response, NextFunction } from "express";
import { ApiError } from "./middlewares";
import httpStatus from "http-status";

type Schema = {
  params?: {
    [key: string]: string;
  };
  query?: {
    [key: string]: string;
  };
  body?: {
    [key: string]: any;
  };
};

/**
 * Takes in a Joi object schema, and throws an Api error if the request
 * is not valid
 * @param schema
 */
export function validate(schema: ObjectSchema<Schema>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = Joi.compile(schema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(req);

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

export const validatePriceDrop = Joi.object({
  body: {
    productId: Joi.string(),
    retailers: Joi.array().items(
      Joi.object({
        retailerId: Joi.string().required(),
        retailPrice: Joi.number().required(),
        isInStock: Joi.boolean().required(),
        discountPrice: Joi.number(),
      })
    ),
  },
});

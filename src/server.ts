import express, { Express } from "express";
import bodyParser from "body-parser";
import { getRoutes } from "./routes";

import { errorMiddleware } from "./middlewares";
import { PriceDB } from "./db";

function startServer(dbSeed?: PriceDB): Express {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(errorMiddleware);
  app.use("/api", getRoutes(dbSeed));
  return app;
}

export { startServer };

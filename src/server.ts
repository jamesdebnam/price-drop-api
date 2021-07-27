import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { getRoutes } from "./routes";

import {errorMiddleware} from "./middlewares";

function startServer() {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.listen(3001, () => {
    console.info(`Listening on port 3001`);
  });


  app.use(errorMiddleware);
  app.use("/api", getRoutes());
}

export { startServer };

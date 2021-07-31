import request from "supertest";
import { startServer } from "./server";
import httpStatus from "http-status";
import { PriceDB } from "./db";

describe("/api/pricedrop endpoint", () => {
  const db = new PriceDB();
  const app = startServer(db);

  beforeEach(() => {
    db.clearPrices();
  });

  it("rejects requests with an empty body", async () => {
    const res = await request(app).get("/api/pricedrop");
    expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
  });

  it("rejects requests with an empty retailers array", async () => {
    const res = await request(app).get("/api/pricedrop").send({
      productId: "test",
      retailers: [],
    });
    expect(res.statusCode).toEqual(httpStatus.BAD_REQUEST);
  });

  it("returns no price update if db is empty", async () => {
    const res = await request(app)
      .get("/api/pricedrop")
      .send({
        productId: "test",
        retailers: [
          {
            retailerId: "nike",
            retailPrice: 20,
            isInStock: true,
          },
        ],
      });
    expect(res.body).toEqual({ alertRequired: false });
  });

  it("returns price update if pre-existing higher price exists", async () => {
    db.seedPrices({ test: 31 });
    const res = await request(app)
      .get("/api/pricedrop")
      .send({
        productId: "test",
        retailers: [
          {
            retailerId: "nike",
            retailPrice: 20,
            isInStock: true,
          },
        ],
      });
    expect(res.body).toEqual({
      alertRequired: true,
      newPrice: 20,
      retailerId: "nike",
      productId: "test",
    });
  });

  it("counts discountPrice over retailPrice", async () => {
    db.seedPrices({ test: 31 });
    const res = await request(app)
      .get("/api/pricedrop")
      .send({
        productId: "test",
        retailers: [
          {
            retailerId: "nike",
            retailPrice: 30,
            discountPrice: 14,
            isInStock: true,
          },
          {
            retailerId: "adidas",
            retailPrice: 15,
            isInStock: true,
          },
        ],
      });
    expect(res.body).toEqual({
      alertRequired: true,
      newPrice: 14,
      retailerId: "nike",
      productId: "test",
    });
  });

  it("correctly saves lowest prices between requests", async () => {
    const res1 = await request(app)
      .get("/api/pricedrop")
      .send({
        productId: "test",
        retailers: [
          {
            retailerId: "adidas",
            retailPrice: 15,
            isInStock: true,
          },
        ],
      });
    expect(res1.body).toEqual({ alertRequired: false });

    const res2 = await request(app)
      .get("/api/pricedrop")
      .send({
        productId: "test",
        retailers: [
          {
            retailerId: "nike",
            retailPrice: 44,
            discountPrice: 3,
            isInStock: true,
          },
        ],
      });
    expect(res2.body).toEqual({
      alertRequired: true,
      newPrice: 3,
      retailerId: "nike",
      productId: "test",
    });
  });
});

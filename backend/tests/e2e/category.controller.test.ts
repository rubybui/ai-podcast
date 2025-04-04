import * as request from "supertest";
import { app } from "../../app";
import { connectToTestDb, closeTestDb } from "../../services";

beforeAll(async () => {
  await connectToTestDb();
});
afterAll(() => closeTestDb());

describe("CategoryController()", () => {
  let id: string;
  describe("POST /api/categories", () => {
    test("success", () => {
      return request(app)
        .post("/api/categories")
        .send({
          name: "mocked",
        })
        .then((response) => {
          id = response.body.data._id;
          expect(response.statusCode).toBe(201);
          expect(response.body.data).toMatchObject({
            name: "mocked",
          });
        });
    });
  });

  describe("GET /api/categories", () => {
    test("success", () => {
      return request(app)
        .get("/api/categories")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body.data[0]._id).toBe(id);
        });
    });
  });
});

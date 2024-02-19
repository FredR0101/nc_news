const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { expect } = require("@jest/globals");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("should return status code of 200 ", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should return a length of 3", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        expect(result.body.length).toBe(3);
      });
  });
  test("should return an array of objects with the correct key value pairs", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        const body = response.body;
        body.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test('should return an arror if incorrect path is given to the API', () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found")
      })
  });
});

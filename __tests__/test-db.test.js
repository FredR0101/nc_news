const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("should return an object with the key of topics and the value of the data itself.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        expect(result.body.topics.rows.length).toBe(3);
        const body = result.body.topics.rows;
        body.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("should return an arror if incorrect path is given to the API", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api", () => {
  test("Each API search should contain the correct keys and values", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((data) => {
        expect(data.body).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Should return an object with the key of Article and the value of the data itself, specified by the Id given", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((result) => {
        const body = result.body.article;
        expect(body.article_id === 3);
        expect(body).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("should return 400 code and correct message when passed an id that is not a number", () => {
    return request(app)
      .get("/api/articles/not_an_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should return error code 404 and error message when passed a id that is a number but doesnt exist in the database", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("should return an array of all article objects, each containing the right data", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        const body = result.body;
        expect(result.body).toBeSortedBy("created_at", { descending: true });
        body.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("should return an error if wrong API path is written", () => {
    return request(app)
      .get("/api/artcles")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

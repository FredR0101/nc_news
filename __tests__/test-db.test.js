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
      .get("/api/articles/1")
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
        const body = result.body.articles;
        expect(body).toBeSortedBy("created_at", {
          descending: true,
        });
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
});

describe("GET /api/articles/article_id/comments", () => {
  test("should return an array of comment objects with the correct key value data, based on a specific id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        const body = result.body.article;
        expect(result.body.article).toBeSortedBy("created_at", {
          descending: true,
        });
        body.forEach((comment) => {
          expect(comment.article_id === 1);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("should return 400 code and correct message when passed an id that is not a number", () => {
    return request(app)
      .get("/api/articles/not_an_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should return error code 404 and error message when passed a id that is a number but doesnt exist in the database", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("should return the article with code 200 if the article exists but there is no comments present", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((result) => {
        const body = result.body.article;
        expect(body.length).toBe(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should retrieve a post request and insert it into the comments.", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "icellusedkars", body: "This is a new comment" })
      .expect(201);
  });
  test("If passed an empty field for any key, return appropriate error", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "icellusedkars" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid data input");
      });
  });
  test("If passed a user that doest exist on the user database, return appropriate error", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "icellars", body: "This is a new comment" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH /api/article/:article_id", () => {
  test("should return the object with the correct status code and the correct amount of new votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -25 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(75);
      });
  });
  test("should return the object with the correct status code and the correct amount of new votes", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 25 })
      .expect(200)
      .then((response) => {
        expect(response.body.article.votes).toBe(25);
      });
  });
  test("should return correct error if votes go below 0", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: -26 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Votes cannot go below 0");
      });
  });
  test("should return correct error if id passed in is not a number", () => {
    return request(app)
      .patch("/api/articles/not_a_number")
      .send({ inc_votes: -26 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should return error code 404 and error message when passed a id that is a number but doesnt exist in the database", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: -26 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should delete the comment when provided the comment id, ", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
});
test("should return correct error if id passed in is not a number", () => {
  return request(app)
    .delete("/api/comments/not_a_number")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
test("should return error code 404 and error message when passed a id that is a number but doesnt exist in the database", () => {
  return request(app)
    .delete("/api/comments/999")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Comment not found");
    });
});

describe("GET /api/users", () => {
  test("should return a list of all users with the correct data", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((result) => {
        const body = result.body.users;
        body.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles(topicQuery)", () => {
  test("accept a topic query and return the correct status with only the data related to the specified query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((result) => {
        expect(result.body.articles.length).toBe(1);
        expect(result.body.articles).toBeSortedBy("cats");
      });
  });
  test("Should return an error if passed a query that is not accepted in the topic variables", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Not found");
      });
  });
  test("should return an empty array if passed a topic that has no articles connected to it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((result) => {
        expect(result.body.articles.length).toBe(0);
        expect(result.body.articles).toBeSortedBy("paper");
      });
  });
});

describe("GET /api/articles/:article_id(comment_count)", () => {
  test("should return a totoal of all the comments in an article specified by ID, add to the article as a comment_count key/value.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((result) => {
        const body = result.body.article;
        expect(body.article_id).toBe(1);
        expect(body.title).toBe("Living in the shadow of a great man");
        expect(body.topic).toBe("mitch");
        expect(body.author).toBe("butter_bridge");
        expect(body.body).toBe("I find this existence challenging");
        expect(body.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(body.votes).toBe(75);
        expect(body.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(body.comment_count).toBe("11");
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

describe("GET /api/articles(sorting query)", () => {
  test("accept a sort_by and order query and return the correct status with only the data related to the specified query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ASC")
      .expect(200)
      .then((result) => {
        expect(result.body.articles).toBeSortedBy("author", {
          ascending: true,
        });
      });
  });
  test("Should return an error if passed a query that is not accepted in the sort_by variables", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=ASC")
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Not found");
      });
  });
  test("Should return an error if passed a query that is not accepted in the order variables", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=diagonal")
      .expect(404)
      .then((response) => {
        const error = response.body;
        expect(error.msg).toBe("Not found");
      });
  });
});
